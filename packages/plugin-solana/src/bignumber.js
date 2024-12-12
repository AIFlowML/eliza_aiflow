import BigNumber from "bignumber.js";
// Re-export BigNumber constructor
export const BN = BigNumber;
// Helper function to create new BigNumber instances
export function toBN(value) {
    return new BigNumber(value);
}
//# sourceMappingURL=bignumber.js.map