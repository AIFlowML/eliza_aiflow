import os from "os";
const platform = os.platform();

if (
    platform === "linux" ||
    platform === "win32" ||
    platform === "darwin"
) {
    console.log(
        "Installing Playwright on platform:",
        platform
    );
    const { execSync } = await import("child_process");
    execSync("npx playwright install-deps && npx playwright install", {
        stdio: "inherit",
    });
} else {
    console.log(
        "Skipping playwright installation on unsupported platform:",
        platform
    );
    process.exit(0);
}
