import {app, BrowserWindow, Menu, ipcMain, IpcMessageEvent, Accelerator} from "electron";
import * as url from "url";
import * as path from "path";
import * as fs from "fs";
import * as console from "console";
import { platform } from "os";
let mainWindow:BrowserWindow = null;
let addWindow:BrowserWindow = null;
const createMainWindow = () =>{
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    mainWindow.loadFile("main.html");
    mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () =>{
        app.quit();
    });
    Menu.setApplicationMenu(Menu.buildFromTemplate([ process.platform === "darwin" ? {label: app.getName()} : null ,{
            label:"Archivo",
            submenu:[{
                    label: "Añadir",
                    accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
                    click(){
                        createAddWindow();
                    }
                },
                {
                    label: "Editar"
                },
                {
                    label: "Eliminar"
                },
                {
                    label: "Salir",
                    accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
                    click(){
                        app.quit();
                    }
                },
                {
                    label: "Cerrar pestaña",
                    accelerator: process.platform === "darwin" ? "Command+W" : "Ctrl+W",
                    role: "close"
                }
            ]
        },
        {
            label: "Ventas",
            submenu:[]
        },
        {
            label: "Base de datos",
            submenu:[]
        },
        {
            label: "Cotizaciones",
            submenu:[]
        },
        {
            label: "Compras",
            submenu:[]
        },
        {
            label: "Clientes",
            submenu:[]
        },
        {
            label: "Facturas",
            submenu:[]
        }
    ]));
}

const createAddWindow = ()=>{
    addWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences:{
            nodeIntegration: true
        }
    });
    addWindow.loadFile("add.html");
    addWindow.webContents.openDevTools();
}

app.on("ready", createMainWindow);
app.on("window-all-closed", () =>{
   if(process.platform !== "darwin"){
       app.quit();
   } 
});

app.on("activate", () =>{
    if(mainWindow === null){
        createMainWindow();
    }
});

ipcMain.on("fileDropped", (e, path:string)=>{
    const extension = path.split(".")[1];
    if(extension === "json"){
        const data = fs.readFileSync(path,"utf-8");
        mainWindow.webContents.send("file", data);
    }else{
        mainWindow.webContents.send("fileNotSupported");
    }
});