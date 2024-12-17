"""Code Analyzer Tool

This tool provides static code analysis for Python, TypeScript, and JavaScript files.
"""

import os
import ast
import json
import subprocess
from typing import Dict, List, Optional, Union
import radon.complexity as radon_cc
import radon.metrics as radon_metrics
import radon.raw as radon_raw
import esprima
from pyright import cli as pyright_cli
import bandit.core.manager as bandit_mgr
from bandit.core.config import BanditConfig
from bandit.core.meta_ast import BanditMetaAst

class CodeAnalyzer:
    """Multi-language code analyzer supporting Python, TypeScript, and JavaScript."""

    def __init__(self):
        """Initialize the code analyzer."""
        self.supported_extensions = ['.py', '.ts', '.js']

    def analyze_complexity(self, file_path: str) -> Dict:
        """Analyze code complexity.

        Args:
            file_path (str): Path to the file to analyze

        Returns:
            Dict: Complexity metrics
        """
        ext = os.path.splitext(file_path)[1]
        if ext not in self.supported_extensions:
            return {"error": f"Unsupported file type: {ext}"}

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            if ext == '.py':
                # Use radon for Python files
                complexity = radon_cc.cc_visit(content)
                return {
                    "overall_complexity": sum(cc.complexity for cc in complexity),
                    "per_function": [
                        {
                            "name": cc.name,
                            "complexity": cc.complexity,
                            "lineno": cc.lineno
                        } for cc in complexity
                    ]
                }
            else:
                # Use esprima for TS/JS files
                ast = esprima.parseScript(content, {'loc': True})
                complexity = self._calculate_js_complexity(ast)
                return complexity
        except Exception as e:
            return {"error": str(e)}

    def analyze_quality(self, file_path: str) -> Dict:
        """Analyze code quality.

        Args:
            file_path (str): Path to the file to analyze

        Returns:
            Dict: Quality metrics and issues
        """
        ext = os.path.splitext(file_path)[1]
        if ext not in self.supported_extensions:
            return {"error": f"Unsupported file type: {ext}"}

        try:
            if ext == '.py':
                # Use pylint for Python files
                cmd = f"pylint --output-format=json {file_path}"
                result = subprocess.run(cmd.split(), capture_output=True, text=True)
                if result.stdout:
                    issues = json.loads(result.stdout)
                    return {
                        "issues": issues,
                        "score": 10 - (len(issues) * 0.1)  # Simple scoring
                    }
                return {"issues": [], "score": 10}
            else:
                # Use ESLint-like analysis for TS/JS
                with open(file_path, 'r') as f:
                    content = f.read()
                ast = esprima.parseScript(content, {'loc': True, 'comment': True})
                return self._analyze_js_quality(ast)
        except Exception as e:
            return {"error": str(e)}

    def analyze_dependencies(self, file_path: str) -> Dict:
        """Analyze code dependencies.

        Args:
            file_path (str): Path to the file to analyze

        Returns:
            Dict: Dependency information
        """
        ext = os.path.splitext(file_path)[1]
        if ext not in self.supported_extensions:
            return {"error": f"Unsupported file type: {ext}"}

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            if ext == '.py':
                tree = ast.parse(content)
                imports = []
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        imports.extend(n.name for n in node.names)
                    elif isinstance(node, ast.ImportFrom):
                        imports.append(f"{node.module}.{node.names[0].name}")
                return {"imports": imports}
            else:
                # Use esprima for TS/JS files
                ast = esprima.parseScript(content)
                return self._analyze_js_dependencies(ast)
        except Exception as e:
            return {"error": str(e)}

    def get_code_metrics(self, file_path: str) -> Dict:
        """Get code metrics.

        Args:
            file_path (str): Path to the file to analyze

        Returns:
            Dict: Code metrics
        """
        ext = os.path.splitext(file_path)[1]
        if ext not in self.supported_extensions:
            return {"error": f"Unsupported file type: {ext}"}

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            if ext == '.py':
                raw_metrics = radon_raw.analyze(content)
                return {
                    "loc": raw_metrics.loc,
                    "lloc": raw_metrics.lloc,
                    "sloc": raw_metrics.sloc,
                    "comments": raw_metrics.comments,
                    "multi": raw_metrics.multi,
                    "blank": raw_metrics.blank,
                    "single_comments": raw_metrics.single_comments
                }
            else:
                # Use esprima for TS/JS files
                ast = esprima.parseScript(content, {'loc': True, 'comment': True})
                return self._calculate_js_metrics(ast)
        except Exception as e:
            return {"error": str(e)}

    def analyze_security(self, file_path: str) -> Dict:
        """Analyze code for security issues.

        Args:
            file_path (str): Path to the file to analyze

        Returns:
            Dict: Security analysis results
        """
        ext = os.path.splitext(file_path)[1]
        if ext not in self.supported_extensions:
            return {"error": f"Unsupported file type: {ext}"}

        try:
            if ext == '.py':
                # Use bandit for Python files
                config = BanditConfig()
                manager = bandit_mgr.BanditManager(config, 'file')
                manager.discover_files([file_path])
                manager.run_tests()
                return {
                    "issues": manager.get_issue_list(),
                    "metrics": manager.metrics.data
                }
            else:
                # Basic security analysis for TS/JS
                with open(file_path, 'r') as f:
                    content = f.read()
                return self._analyze_js_security(content)
        except Exception as e:
            return {"error": str(e)}

    def _calculate_js_complexity(self, ast: esprima.nodes.Node) -> Dict:
        """Calculate complexity metrics for JavaScript/TypeScript code."""
        complexity = {
            "overall_complexity": 0,
            "per_function": []
        }

        def visit_node(node, parent=None):
            if node.type == 'FunctionDeclaration' or node.type == 'FunctionExpression':
                func_complexity = 1  # Base complexity

                # Count decision points
                for child in node.body.body:
                    if child.type in ['IfStatement', 'ForStatement', 'WhileStatement', 'DoWhileStatement']:
                        func_complexity += 1

                complexity["per_function"].append({
                    "name": node.id.name if hasattr(node, 'id') and node.id else "<anonymous>",
                    "complexity": func_complexity,
                    "lineno": node.loc.start.line
                })
                complexity["overall_complexity"] += func_complexity

            for key, value in node.__dict__.items():
                if isinstance(value, esprima.nodes.Node):
                    visit_node(value, node)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, esprima.nodes.Node):
                            visit_node(item, node)

        visit_node(ast)
        return complexity

    def _analyze_js_quality(self, ast: esprima.nodes.Node) -> Dict:
        """Analyze JavaScript/TypeScript code quality."""
        issues = []

        def visit_node(node, parent=None):
            # Check for common issues
            if node.type == 'VariableDeclaration':
                if node.kind == 'var':
                    issues.append({
                        "message": "Use 'let' or 'const' instead of 'var'",
                        "line": node.loc.start.line,
                        "severity": "warning"
                    })

            elif node.type == 'FunctionDeclaration':
                if len(node.params) > 4:
                    issues.append({
                        "message": "Function has too many parameters (>4)",
                        "line": node.loc.start.line,
                        "severity": "warning"
                    })

            # Recursively visit child nodes
            for key, value in node.__dict__.items():
                if isinstance(value, esprima.nodes.Node):
                    visit_node(value, node)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, esprima.nodes.Node):
                            visit_node(item, node)

        visit_node(ast)
        return {
            "issues": issues,
            "score": 10 - (len(issues) * 0.1)  # Simple scoring
        }

    def _analyze_js_dependencies(self, ast: esprima.nodes.Node) -> Dict:
        """Analyze JavaScript/TypeScript dependencies."""
        imports = []

        def visit_node(node):
            if node.type == 'ImportDeclaration':
                imports.append(node.source.value)
            elif node.type == 'CallExpression' and node.callee.name == 'require':
                if node.arguments and node.arguments[0].type == 'Literal':
                    imports.append(node.arguments[0].value)

            for key, value in node.__dict__.items():
                if isinstance(value, esprima.nodes.Node):
                    visit_node(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, esprima.nodes.Node):
                            visit_node(item)

        visit_node(ast)
        return {"imports": imports}

    def _calculate_js_metrics(self, ast: esprima.nodes.Node) -> Dict:
        """Calculate metrics for JavaScript/TypeScript code."""
        metrics = {
            "loc": 0,
            "lloc": 0,
            "sloc": 0,
            "comments": 0,
            "functions": 0,
            "classes": 0
        }

        # Count lines from location info
        metrics["loc"] = ast.loc.end.line

        def visit_node(node):
            if node.type == 'FunctionDeclaration' or node.type == 'FunctionExpression':
                metrics["functions"] += 1
            elif node.type == 'ClassDeclaration':
                metrics["classes"] += 1

            for key, value in node.__dict__.items():
                if isinstance(value, esprima.nodes.Node):
                    visit_node(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, esprima.nodes.Node):
                            visit_node(item)

        visit_node(ast)

        # Count comments
        if hasattr(ast, 'comments'):
            metrics["comments"] = len(ast.comments)

        return metrics

    def _analyze_js_security(self, content: str) -> Dict:
        """Basic security analysis for JavaScript/TypeScript code."""
        issues = []

        # Check for common security issues
        security_patterns = {
            r"eval\(": "Potentially dangerous use of eval()",
            r"document\.write\(": "Potentially dangerous use of document.write()",
            r"innerHTML\s*=": "Potentially unsafe use of innerHTML",
            r"localStorage\.": "Check for sensitive data in localStorage",
            r"sessionStorage\.": "Check for sensitive data in sessionStorage",
            r"password\s*=": "Possible hardcoded password",
            r"api[_-]?key\s*=": "Possible hardcoded API key"
        }

        for line_num, line in enumerate(content.split('\n'), 1):
            for pattern, message in security_patterns.items():
                if pattern in line:
                    issues.append({
                        "line": line_num,
                        "message": message,
                        "severity": "high"
                    })

        return {
            "issues": issues,
            "total_issues": len(issues)
        }