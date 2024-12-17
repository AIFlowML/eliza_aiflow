"""Test file for Monitor tool"""

from tools.Monitor import Monitor

def test_monitor():
    # Initialize the monitor
    monitor = Monitor()

    print("\nTesting system monitoring...")

    # Test CPU monitoring
    print("\nCPU Usage:")
    cpu_info = monitor.get_cpu_usage()
    print(cpu_info)

    # Test memory monitoring
    print("\nMemory Usage:")
    memory_info = monitor.get_memory_usage()
    print(memory_info)

    # Test disk monitoring
    print("\nDisk Usage:")
    disk_info = monitor.get_disk_usage()
    print(disk_info)

    # Test process monitoring
    print("\nTop Processes:")
    process_info = monitor.get_top_processes(limit=5)
    print(process_info)

    # Test system info
    print("\nSystem Information:")
    sys_info = monitor.get_system_info()
    print(sys_info)

if __name__ == "__main__":
    test_monitor()