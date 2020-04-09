"use strict";
import * as vscode from "vscode";
import * as StatusBar from "../../components/StatusBar";
import * as CommonInterface from "./CommonInterface";
import { ReactPanelForceGraph3DManager } from "./ReactPanel";
import { setInterval } from "timers";

export class StatusBarForceGraph3DManager {
    private static _key: string | undefined = undefined;
    public static get key(): string | undefined {
        return StatusBarForceGraph3DManager._key;
    }
    private static _bar: StatusBar.StatusBar | undefined = undefined;
    public static get bar(): StatusBar.StatusBar | undefined {
        return StatusBarForceGraph3DManager._bar;
    }
    private static _switchBar:
        | CommonInterface.SwitchBar
        | undefined = undefined;
    public static get switchBar(): CommonInterface.SwitchBar | undefined {
        return StatusBarForceGraph3DManager._switchBar;
    }
    private static _barSituation:
        | CommonInterface.BarSituation
        | undefined = undefined;
    public static get barSituation(): CommonInterface.BarSituation | undefined {
        return StatusBarForceGraph3DManager._barSituation;
    }

    public static initial(coreData: CommonInterface.ConfigPath): boolean {
        if (this.bar === undefined) {
            const result = StatusBar.ManageStatusBar.createStatusBarByJsonFile(
                coreData.barConfigPath
            );

            this._switchBar = CommonInterface.SwitchBar.off;
            this._barSituation = CommonInterface.BarSituation.running;

            this._key = StatusBar.ManageStatusBar.recognizeKey(
                coreData.barConfigPath
            );
            this._bar = StatusBar.ManageStatusBar.findStatusBar(this._key);

            return result;
        }
        return false;
    }

    // This function is used for command control bar
    public static switchTurn() {
        if (!this.couldSwitchTurn()) {
            vscode.window.showWarningMessage("Waiting for loading...");
            return;
        }
        this._switchStatusChange();
        this._refreshBar();
    }

    public static couldSwitchTurn(): boolean {
        return this.barSituation === CommonInterface.BarSituation.running
            ? true
            : false;
    }

    private static _switchStatusChange() {
        this._switchBar =
            this.switchBar === CommonInterface.SwitchBar.off
                ? CommonInterface.SwitchBar.on
                : CommonInterface.SwitchBar.off;
    }

    // This function is used for panel control bar
    public static switchTurnOn(): boolean {
        if (this.switchBar === CommonInterface.SwitchBar.off) {
            this._switchStatusChange();
            this.refreshBarBase(StatusBar.StatusCode.running);
            return true;
        } else {
            return false;
        }
    }

    // This function is used for panel control bar
    public static switchTurnOff(): boolean {
        if (this.switchBar === CommonInterface.SwitchBar.on) {
            this._switchStatusChange();
            this.refreshBarBase(StatusBar.StatusCode.halting);
            return true;
        } else {
            return false;
        }
    }

    private static _refreshBar() {
        if (this.switchBar === CommonInterface.SwitchBar.on) {
            this.refreshBarBase(StatusBar.StatusCode.running);
        } else {
            this.refreshBarBase(StatusBar.StatusCode.halting);
        }
    }

    private static refreshBarBase(statusCode: number) {
        if (this.bar !== undefined && this.bar.statusBarInfoUnit !== null) {
            this.bar.setStatusBar(
                this.bar.statusBarInfoUnit["unit"][StatusBar.StatusCode.loading]
            );
            this._barSituation = CommonInterface.BarSituation.waiting;
        } else {
            vscode.window.showErrorMessage(
                "RefreshBarBase bar.statusBarInfoUnit is null"
            );
            return;
        }

        const handle: NodeJS.Timeout = setInterval(() => {
            if (this.webPanelReady()) {
                if (
                    this.bar !== undefined &&
                    this.bar.statusBarInfoUnit !== null
                ) {
                    this.bar.setStatusBar(
                        this.bar.statusBarInfoUnit["unit"][statusCode]
                    );
                    this._barSituation = CommonInterface.BarSituation.running;
                } else {
                    vscode.window.showErrorMessage(
                        "SetTimeout bar.statusBarInfoUnit is null"
                    );
                    return;
                }
                clearInterval(handle);
            }
        }, 100);
    }

    private static webPanelReady(): boolean{
        if(this.switchBar === CommonInterface.SwitchBar.on && ReactPanelForceGraph3DManager.hasKey()){
            return true;
        }

        if(this.switchBar === CommonInterface.SwitchBar.off && !ReactPanelForceGraph3DManager.hasKey()){
            return true;
        }

        return false;
    }
}