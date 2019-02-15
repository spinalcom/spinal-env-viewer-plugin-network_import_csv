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
  SpinalForgeExtention
} = require("spinal-env-viewer-panel-manager-service_spinalforgeextention");

import Vue from "vue";
import aVueCompoment from "../spinal-import-csv-container.vue";

const extentionCreated = SpinalForgeExtention.createExtention({
  name: "spinal-env-viewer-plugin-network_import_csv",
  vueMountComponent: Vue.extend(aVueCompoment),
  panel: {
    title: "Endpoint Chart viewer",
    classname: "spinal-env-viewer-plugin-network_import_csv",
    closeBehaviour: "delete"
  },
  style: {
    height: '80vh',
    left: "405px",
    width: '631px'
  }
});

SpinalForgeExtention.registerExtention("spinal-env-viewer-plugin-network_import_csv",
  extentionCreated);

