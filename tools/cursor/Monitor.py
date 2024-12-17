import os
import time
import json
from typing import Dict, List, Optional
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agent_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('AgentMonitor')

class AgentMarkers:
    START = "# AgentTask: START"
    IN_PROGRESS = "# AgentTask: IN_PROGRESS"
    REVIEW = "# AgentTask: REVIEW_NEEDED"
    HANDOFF = "# AgentTask: HANDOFF"
    DONE = "# AgentTask: DONE"

class AgentMonitor(FileSystemEventHandler):
    def __init__(self, working_dir: str):
        self.working_dir = working_dir
        self.reports_dir = os.path.join(working_dir, "reports")
        self.observer = Observer()
        self.current_task: Dict = {}
        self.ensure_reports_directory()
        
    def ensure_reports_directory(self):
        """Create reports directory if it doesn't exist"""
        if not os.path.exists(self.reports_dir):
            os.makedirs(self.reports_dir)
            logger.info(f"Created reports directory: {self.reports_dir}")

    def start_monitoring(self):
        """Start monitoring the working directory"""
        self.observer.schedule(self, self.working_dir, recursive=True)
        self.observer.start()
        logger.info(f"Started monitoring directory: {self.working_dir}")

    def stop_monitoring(self):
        """Stop monitoring the working directory"""
        self.observer.stop()
        self.observer.join()
        logger.info("Stopped monitoring")

    def on_modified(self, event):
        if not event.is_directory and (event.src_path.endswith('.ts') or event.src_path.endswith('.js')):
            self.check_file_markers(event.src_path)

    def check_file_markers(self, file_path: str):
        """Check file for agent markers and handle accordingly"""
        try:
            with open(file_path, 'r') as file:
                content = file.read()
                
                # Check for markers in order of workflow
                if AgentMarkers.START in content:
                    self.handle_task_start(file_path, content)
                elif AgentMarkers.HANDOFF in content:
                    self.handle_task_handoff(file_path, content)
                elif AgentMarkers.DONE in content:
                    self.handle_task_completion(file_path, content)
        except Exception as e:
            logger.error(f"Error checking file {file_path}: {str(e)}")

    def handle_task_start(self, file_path: str, content: str):
        """Handle task start marker"""
        task_info = {
            'file': file_path,
            'status': 'started',
            'timestamp': time.time(),
            'agent': 'IssueSolverAgent'
        }
        self.current_task = task_info
        self.create_report('task_start', task_info)
        logger.info(f"Task started in {file_path}")

    def handle_task_handoff(self, file_path: str, content: str):
        """Handle task handoff from IssueSolverAgent to DebugAgent"""
        if self.current_task.get('status') == 'started':
            self.current_task.update({
                'status': 'handoff',
                'handoff_timestamp': time.time(),
                'next_agent': 'DebugAgent'
            })
            self.create_report('task_handoff', self.current_task)
            logger.info(f"Task handed off to DebugAgent: {file_path}")

    def handle_task_completion(self, file_path: str, content: str):
        """Handle task completion marker"""
        if self.current_task.get('status') == 'handoff':
            self.current_task.update({
                'status': 'completed',
                'completion_timestamp': time.time()
            })
            self.create_report('task_completion', self.current_task)
            logger.info(f"Task completed: {file_path}")

    def create_report(self, report_type: str, data: Dict):
        """Create a markdown report for the task"""
        timestamp = time.strftime('%Y%m%d_%H%M%S')
        report_file = os.path.join(self.reports_dir, f'{report_type}_{timestamp}.md')
        
        with open(report_file, 'w') as f:
            f.write(f"# {report_type.replace('_', ' ').title()} Report\n\n")
            f.write(f"## Overview\n")
            f.write(f"- File: `{os.path.basename(data['file'])}`\n")
            f.write(f"- Status: {data['status']}\n")
            f.write(f"- Agent: {data.get('agent', 'Unknown')}\n")
            f.write(f"- Timestamp: {time.ctime(data['timestamp'])}\n\n")
            
            if 'handoff_timestamp' in data:
                f.write(f"## Handoff Details\n")
                f.write(f"- Next Agent: {data['next_agent']}\n")
                f.write(f"- Handoff Time: {time.ctime(data['handoff_timestamp'])}\n\n")
            
            if 'completion_timestamp' in data:
                f.write(f"## Completion Details\n")
                f.write(f"- Completion Time: {time.ctime(data['completion_timestamp'])}\n")
                duration = data['completion_timestamp'] - data['timestamp']
                f.write(f"- Total Duration: {duration:.2f} seconds\n")

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Monitor TypeScript/JavaScript files for agent tasks')
    parser.add_argument('working_dir', help='Directory to monitor')
    args = parser.parse_args()

    monitor = AgentMonitor(args.working_dir)
    
    try:
        monitor.start_monitoring()
        logger.info("Press Ctrl+C to stop monitoring")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        monitor.stop_monitoring()
        logger.info("Monitoring stopped by user")

if __name__ == "__main__":
    main()