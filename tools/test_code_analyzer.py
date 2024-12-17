"""Test file for Code Analyzer tool"""

from tools.code_analyzer import CodeAnalyzer

def test_code_analyzer():
    # Initialize the analyzer
    analyzer = CodeAnalyzer()

    # Test files
    python_file = "tools/Monitor.py"
    js_file = "agent/src/index.ts"  # TypeScript file

    print("\nTesting Python file analysis...")
    print(f"File: {python_file}")

    # Test code complexity analysis
    print("\nCode Complexity Analysis:")
    complexity = analyzer.analyze_complexity(python_file)
    print(complexity)

    # Test code quality analysis
    print("\nCode Quality Analysis:")
    quality = analyzer.analyze_quality(python_file)
    print(quality)

    # Test dependency analysis
    print("\nDependency Analysis:")
    deps = analyzer.analyze_dependencies(python_file)
    print(deps)

    # Test code metrics
    print("\nCode Metrics:")
    metrics = analyzer.get_code_metrics(python_file)
    print(metrics)

    # Test security analysis
    print("\nSecurity Analysis:")
    security = analyzer.analyze_security(python_file)
    print(security)

    print("\n" + "="*80 + "\n")

    print("\nTesting TypeScript/JavaScript file analysis...")
    print(f"File: {js_file}")

    # Test code complexity analysis
    print("\nCode Complexity Analysis:")
    complexity = analyzer.analyze_complexity(js_file)
    print(complexity)

    # Test code quality analysis
    print("\nCode Quality Analysis:")
    quality = analyzer.analyze_quality(js_file)
    print(quality)

    # Test dependency analysis
    print("\nDependency Analysis:")
    deps = analyzer.analyze_dependencies(js_file)
    print(deps)

    # Test code metrics
    print("\nCode Metrics:")
    metrics = analyzer.get_code_metrics(js_file)
    print(metrics)

    # Test security analysis
    print("\nSecurity Analysis:")
    security = analyzer.analyze_security(js_file)
    print(security)

if __name__ == "__main__":
    test_code_analyzer()