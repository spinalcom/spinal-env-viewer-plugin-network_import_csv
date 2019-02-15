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
  spinalContextMenuService,
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");


import {SpinalGraph} from "spinal-env-viewer-graph-service";

const {
  createBmsNetworkContext
} = require("./handleButtons.js");
class NetworkCreateContextBtn extends SpinalContextApp {
  constructor() {
    super("Create Network Context",
      "Create Network Context", {
        icon: "router",
        icon_type: "in",
        backgroundColor: "#000000",
        fontColor: "#FFFFFF"
      });
  }

  async isShown(option) {
    if (option instanceof SpinalGraph) {
      const contexts = await option.getChildren();
      for (let idx = 0; idx < contexts.length; idx++) {
        const context = contexts[idx];
        if (context.info.name.get() === "Network") {
          return -1;
        }
      }
      return true;
    }
    return -1;
  }

  action() {
    createBmsNetworkContext();
  }
}

spinalContextMenuService.registerApp("GraphManagerTopBar", new NetworkCreateContextBtn());
