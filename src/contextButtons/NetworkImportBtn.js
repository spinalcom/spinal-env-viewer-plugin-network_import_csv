/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

const {
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");
const {
  spinalContextMenuService,
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");


class NetworkImportBtn extends SpinalContextApp {
  constructor() {
    super("Import CSV Endpoint Data",
      "import csv file to fill timeseries data.", {
        icon: "assignment_returned",
        icon_type: "in",
        backgroundColor: "#000000",
        fontColor: "#FFFFFF"
      });
  }

  isShown(option) {
    if (option && option.selectedNode && option.selectedNode.type &&
      option.selectedNode.type.get() === "BmsNetwork") {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("spinal-env-viewer-plugin-network_import_csv", option);
  }
}

spinalContextMenuService.registerApp("GraphManagerSideBar", new NetworkImportBtn(), [3]);
