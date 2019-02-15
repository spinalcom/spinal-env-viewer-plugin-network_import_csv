import {
  SPINAL_RELATION_TYPE,
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

import {SpinalBmsNetwork} from 'spinal-model-bmsnetwork';
import {Model} from 'spinal-core-connectorjs_type';

export async function createSpinalBmsNetwork(contextId, networkName, networkType) {
  const childrenContext = await SpinalGraphService.getChildrenInContext( contextId, contextId );
  for (const childContext of childrenContext) {
    if (typeof childContext.networkName !== 'undefined' &&
        childContext.networkName.get() === networkName) {
      return childContext;
    }
  }
  const res = new SpinalBmsNetwork(networkName, networkType);
  const tmpInfo = {
    networkName: networkName,
    typeName: networkType,
    type: SpinalBmsNetwork.nodeTypeName,
    name: networkName,
    idNetwork: res.id.get()
  };
  const childId = SpinalGraphService.createNode(tmpInfo, res);
  await SpinalGraphService.addChildInContext(
    contextId,
    childId,
    contextId,
    SpinalBmsNetwork.relationName,
    SPINAL_RELATION_TYPE,
  );
  return SpinalGraphService.getInfo(childId);
}

export async function createBmsNetworkContext() {
  let context = SpinalGraphService.getContext('Network');
  if (context === undefined) {
    context = await SpinalGraphService.addContext( 'Network', 'Network', new Model() );
  }
  const contextId = context.getId().get();
  return contextId;
}

