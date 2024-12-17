"""System Monitor Tool

This tool provides functionality for monitoring system resources and performance.
"""

import os
import time
import json
import psutil
import platform
from typing import Dict, List, Optional
from datetime import datetime

class Monitor:
    """System monitoring tool."""

    def __init__(self):
        """Initialize the system monitor."""
        self.start_time = time.time()

    def get_cpu_usage(self) -> Dict:
        """Get CPU usage information."""
        try:
            cpu_percent = psutil.cpu_percent(interval=1, percpu=True)
            cpu_freq = psutil.cpu_freq()
            cpu_info = {
                "overall_percent": sum(cpu_percent) / len(cpu_percent),
                "per_cpu_percent": cpu_percent,
                "frequency_mhz": {
                    "current": cpu_freq.current,
                    "min": cpu_freq.min,
                    "max": cpu_freq.max
                },
                "cores": {
                    "physical": psutil.cpu_count(logical=False),
                    "logical": psutil.cpu_count(logical=True)
                }
            }
            return cpu_info
        except Exception as e:
            return {"error": str(e)}

    def get_memory_usage(self) -> Dict:
        """Get memory usage information."""
        try:
            memory = psutil.virtual_memory()
            swap = psutil.swap_memory()
            memory_info = {
                "ram": {
                    "total_gb": memory.total / (1024**3),
                    "available_gb": memory.available / (1024**3),
                    "used_gb": memory.used / (1024**3),
                    "percent": memory.percent
                },
                "swap": {
                    "total_gb": swap.total / (1024**3),
                    "used_gb": swap.used / (1024**3),
                    "free_gb": swap.free / (1024**3),
                    "percent": swap.percent
                }
            }
            return memory_info
        except Exception as e:
            return {"error": str(e)}

    def get_disk_usage(self) -> Dict:
        """Get disk usage information."""
        try:
            disk_info = {}
            for partition in psutil.disk_partitions():
                try:
                    usage = psutil.disk_usage(partition.mountpoint)
                    disk_info[partition.mountpoint] = {
                        "total_gb": usage.total / (1024**3),
                        "used_gb": usage.used / (1024**3),
                        "free_gb": usage.free / (1024**3),
                        "percent": usage.percent,
                        "fstype": partition.fstype
                    }
                except Exception:
                    continue
            return disk_info
        except Exception as e:
            return {"error": str(e)}

    def get_top_processes(self, limit: int = 5) -> List[Dict]:
        """Get information about top processes by CPU usage."""
        try:
            processes = []
            for proc in sorted(psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']),
                             key=lambda p: p.info['cpu_percent'],
                             reverse=True)[:limit]:
                try:
                    proc_info = proc.info
                    proc_info['memory_mb'] = proc.memory_info().rss / (1024**2)
                    processes.append(proc_info)
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            return processes
        except Exception as e:
            return [{"error": str(e)}]

    def get_system_info(self) -> Dict:
        """Get general system information."""
        try:
            boot_time = datetime.fromtimestamp(psutil.boot_time())
            system_info = {
                "platform": {
                    "system": platform.system(),
                    "release": platform.release(),
                    "version": platform.version(),
                    "machine": platform.machine(),
                    "processor": platform.processor()
                },
                "python_version": platform.python_version(),
                "boot_time": boot_time.isoformat(),
                "uptime_hours": (datetime.now() - boot_time).total_seconds() / 3600
            }
            return system_info
        except Exception as e:
            return {"error": str(e)}

    def get_network_info(self) -> Dict:
        """Get network interface information."""
        try:
            network_info = {
                "interfaces": {},
                "connections": len(psutil.net_connections())
            }

            # Get network interfaces
            for interface, addresses in psutil.net_if_addrs().items():
                network_info["interfaces"][interface] = []
                for addr in addresses:
                    addr_info = {
                        "family": str(addr.family),
                        "address": addr.address,
                        "netmask": addr.netmask
                    }
                    network_info["interfaces"][interface].append(addr_info)

            # Get network I/O counters
            io_counters = psutil.net_io_counters()
            network_info["io_counters"] = {
                "bytes_sent": io_counters.bytes_sent,
                "bytes_recv": io_counters.bytes_recv,
                "packets_sent": io_counters.packets_sent,
                "packets_recv": io_counters.packets_recv
            }

            return network_info
        except Exception as e:
            return {"error": str(e)}