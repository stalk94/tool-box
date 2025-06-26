import { infoSlice } from "../../context";
import EventEmitter from "../../../app/emiter";
import { createState, useLocalStorage } from 'statekit-react';

export const sharedContext = createState('sharedContext', {});
export const sharedEmmiter = new EventEmitter();
