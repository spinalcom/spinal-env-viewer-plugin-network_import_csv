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

const {
  createSpinalBmsNetwork
} = require("./handleButtons.js");

class NetworkCreateBmsNetwork extends SpinalContextApp {
  constructor() {
    super("Create new BMS Network",
      "Create a new BMS Network.", {
        icon: "add",
        icon_type: "in",
        backgroundColor: "#000000",
        fontColor: "#FFFFFF"
      });
  }

  isShown(option) {
    if (option && option.selectedNode && option.selectedNode.name &&
      option.selectedNode.type.get() === "Network") {
      return Promise.resolve(true);
    }
    return Promise.resolve(-1);
  }

  action(option) {
    spinalPanelManagerService.openPanel("confim-dialog-create-network", {
      context: option.context,
      func: createSpinalBmsNetwork
    });
  }
}

spinalContextMenuService.registerApp("GraphManagerSideBar", new NetworkCreateBmsNetwork());
