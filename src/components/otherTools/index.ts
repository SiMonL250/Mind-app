import { Component } from "vue";
import {toolTypes} from "../../interfaces/ComponentProperty"
import HexBinDecOct from "../otherTools/HexBinDecOct/HexBinDecOct.vue";
import Crc from "./Crc/Crc.vue";

export const Components = new Map<string, Component>([
	[toolTypes.HexBinDecOct, HexBinDecOct],
	[toolTypes.CrcCheck, Crc],
]);