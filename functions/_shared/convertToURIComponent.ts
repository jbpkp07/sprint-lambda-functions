import { SLF } from "./types";

const convertToURIComponent: SLF.ConvertToURIComponent = (data: SLF.GenericObj): string => {

    return Object.entries(data)/* 
    */           .map(([key, value]: [string, any]): string => `${key}=${encodeURIComponent(value.toString())}`)/*
    */           .join("&");
};

export = convertToURIComponent;
