import { QWeb } from "./core/qweb_vdom";
import { idGenerator, memoize } from "./core/utils";
import { WEnv } from "./core/widget";
import { ActionManager, IActionManager } from "./services/action_manager";
import { Ajax, IAjax } from "./services/ajax";
import { IRouter, Router } from "./services/router";

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

export interface Menu {
  title: string;
  actionID: number;
}

export interface Env extends WEnv {
  // services
  actionManager: IActionManager;
  ajax: IAjax;
  router: IRouter;
  menus: Menu[];

  // helpers
  rpc: IAjax["rpc"];

  // configuration
  debug: boolean;
}

//------------------------------------------------------------------------------
// Code
//------------------------------------------------------------------------------

/**
 * makeEnvironment returns the main environment for the application.
 *
 * Note that it does not make much sense (except for tests) to have more than
 * one environment. For example, with two environment, the router code in one
 * environment will probably interfere with the code from the other environment.
 *
 * For this reason, the result of makeEnvironment is memoized: every call to
 * this function will actually return the same environment.
 */
export const makeEnvironment = memoize(function(): Env {
  const qweb = new QWeb();
  const router = new Router();
  const ajax = new Ajax();
  const actionManager = new ActionManager(router);
  const menus = [
    { title: "Discuss", actionID: 1 },
    { title: "CRM", actionID: 2 }
  ];

  return {
    // Base widget requirements
    qweb,
    getID: idGenerator(),

    ajax,
    router,
    actionManager,
    menus,

    rpc: ajax.rpc,
    debug: false
  };
});
