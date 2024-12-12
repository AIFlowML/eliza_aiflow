// Browser-compatible logger implementation
type AgentType = 'distribution' | 'evaluation' | 'milestone' | 'submission' | 'error' | 'debug';

interface ColorConfig {
    fg: string;
    icon: string;
}

class BrowserLogger {
    private colors: Record<AgentType, ColorConfig> = {
        distribution: {
            fg: '#3B82F6', // blue-500
            icon: '🔄'
        },
        evaluation: {
            fg: '#10B981', // green-500
            icon: '📊'
        },
        milestone: {
            fg: '#8B5CF6', // purple-500
            icon: '🎯'
        },
        submission: {
            fg: '#06B6D4', // cyan-500
            icon: '📬'
        },
        error: {
            fg: '#EF4444', // red-500
            icon: '❌'
        },
        debug: {
            fg: '#6B7280', // gray-500
            icon: '🔍'
        }
    };

    private formatMessage(agentType: AgentType, message: string): string {
        const timestamp = new Date().toISOString();
        return `${timestamp} ${this.colors[agentType].icon} [${agentType.toUpperCase()}] ${message}`;
    }

    private log(agentType: AgentType, message: string) {
        const color = this.colors[agentType].fg;
        console.log(
            `%c${this.formatMessage(agentType, message)}`,
            `color: ${color}; font-weight: bold;`
        );
    }

    distribution(message: string) {
        this.log('distribution', message);
    }

    evaluation(message: string) {
        this.log('evaluation', message);
    }

    milestone(message: string) {
        this.log('milestone', message);
    }

    submission(message: string) {
        this.log('submission', message);
    }

    error(message: string) {
        this.log('error', message);
    }

    debug(message: string) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message);
        }
    }
}

export const agentLogger = new BrowserLogger();
export default agentLogger;