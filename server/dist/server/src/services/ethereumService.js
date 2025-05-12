"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethereumService = void 0;
const config_1 = require("../config");
const ethers_1 = require("ethers");
const sepolia_json_1 = __importDefault(require("../../../contracts/deployment/sepolia.json"));
class EthereumService {
    constructor() {
        // 1) RPC
        this.provider = new ethers_1.ethers.JsonRpcProvider(config_1.config.ALCHEMY_URL);
        // 2) Server wallet
        this.signer = new ethers_1.ethers.Wallet(config_1.config.PRIVATE_KEY, this.provider);
        this.serverAddress = this.signer.address;
        // 3) Contract
        const { contract: { address, abi }, } = sepolia_json_1.default;
        this.contract = new ethers_1.ethers.Contract(address, abi, this.signer);
    }
    getEthBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield this.provider.getBalance(address);
            return ethers_1.ethers.formatEther(bal);
        });
    }
    getTokenBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const bal = yield this.contract.balanceOf(address);
            return ethers_1.ethers.formatUnits(bal, 18);
        });
    }
    transferTokens(to, amt) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.contract.transfer(to, ethers_1.ethers.parseUnits(amt, 18));
            yield tx.wait();
            return tx.hash;
        });
    }
    sendEth(to, amt) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.signer.sendTransaction({
                to,
                value: ethers_1.ethers.parseEther(amt),
            });
            yield tx.wait();
            return tx.hash;
        });
    }
}
exports.ethereumService = new EthereumService();
