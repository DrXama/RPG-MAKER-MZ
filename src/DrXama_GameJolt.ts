/**
 * @description Plugin de integração do Game Jolt com o RPG MAKER MZ
 * @author Dr.Xamã (GuilhermeSantos001)
 * @update 26/09/2021
 * @version 0.1.0
 */

import { createHash } from 'crypto';
import { compressToBase64, decompressFromBase64 } from 'lz-string';

/**:no-extract
 * @description Game Jolt * Types
 */

/**:no-extract
 * @description Users
 */
export type gameJoltUserType =
  | "User"
  | "Developer"
  | "Moderator"
  | "Administrator"

export type gameJoltUserStatus =
  | "Active"
  | "Banned"

/**:no-extract
* @description Sessions
*/
export type sessionsStatus =
  | "active"
  | "idle"

/**:no-extract
 * @description Data Store
 */
export type dataStoreUpdateTypes =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "append"
  | "prepend"

/**:no-extract
 * @description Game Jolt * Parameters
 */
export interface gameJoltArgs {
  game_id: string;
  privateKey: string;
};

/**:no-extract
 * @description Users
 */

export interface usersAuthArgs extends gameJoltArgs {
  username: string;
  user_token: string;
}

export interface usersFetchArgs extends gameJoltArgs {
  username?: string;
  user_id?: number;
}

/**:no-extract
 * @description Sessions
 */

export interface sessionsOpenArgs extends gameJoltArgs {
  username: string;
  user_token: string;
}

export interface sessionsPingArgs extends gameJoltArgs {
  username: string;
  user_token: string;
  status: sessionsStatus;
}

export interface sessionsCheckArgs extends gameJoltArgs {
  username: string;
  user_token: string;
}

export interface sessionsCloseArgs extends gameJoltArgs {
  username: string;
  user_token: string;
}

/**:no-extract
 * @description Data Store
 */

export interface dataStoreSetArgs extends gameJoltArgs {
  key: string;
  data: string;
  username?: string;
  user_token?: string;
}

export interface dataStoreUpdateArgs extends gameJoltArgs {
  key: string;
  operation: dataStoreUpdateTypes;
  value: string | number;
  username?: string;
  user_token?: string;
}

export interface dataStoreRemoveArgs extends gameJoltArgs {
  key: string;
  username?: string;
  user_token?: string;
}

export interface dataStoreFetchArgs extends gameJoltArgs {
  key: string;
  username?: string;
  user_token?: string;
}

export interface dataStoreGetKeysArgs extends gameJoltArgs {
  pattern?: string;
  username?: string;
  user_token?: string;
}

/**:no-extract
 * @description Game Jolt * Responses
 */
export interface gameJoltResponse {
  success: boolean;
  message: string;
}

/**:no-extract
 * @description Users
 */

export interface usersAuthResponse extends gameJoltResponse { }

export interface usersFetchResponse extends gameJoltResponse {
  users: Omit<IGameJoltUser, "token">[]
}

/**:no-extract
 * @description Sessions
 */

export interface sessionsOpenResponse extends gameJoltResponse { }

export interface sessionsPingResponse extends gameJoltResponse { }
export interface sessionsCheckResponse extends gameJoltResponse { }

export interface sessionsCloseResponse extends gameJoltResponse { }

/**:no-extract
 * @description Data Store
 */
export interface dataStoreSetResponse extends gameJoltResponse { }

export interface dataStoreUpdateResponse extends gameJoltResponse {
  data: string | number;
}

export interface dataStoreRemoveResponse extends gameJoltResponse { }

export interface dataStoreFetchResponse extends gameJoltResponse {
  data: string;
}

export interface dataStoreGetKeysResponse extends gameJoltResponse {
  key: string;
}

/**:no-extract
 * @description Game Jolt
 */
export class GameJolt {
  protected game_id: string;
  protected privateKey: string;
  protected users: GameJoltUser[] = [];
  private readonly sessionPingDelay: number = 30;
  private sessionLastPingTimestamp: Date | boolean = false;

  constructor(game_id: string, privateKey: string) {
    this.game_id = game_id;
    this.privateKey = privateKey;
  }

  getBaseURI(): string {
    return "https://api.gamejolt.com/api/game/v1_2";
  }

  signature = function (data: string): string {
    return createHash('md5').update(data).digest('hex');
  };

  send<Response>(uri: string): Promise<Response> {
    return new Promise((resolve, reject) => {
      fetch(uri)
        .then(res => res.json())
        .then(res => resolve(res.response))
        .catch(error => reject(error));
    })
  }

  /**:no-extract
  * @description Users
  */
  usersAuth<Response extends usersAuthResponse, Args extends usersAuthArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/users/auth/?game_id=${args.game_id}&username=${args.username}&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  usersFetch<Response extends usersFetchResponse, Args extends usersFetchArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/users/?game_id=${args.game_id}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_id)
        uri += `&user_id=${args.user_id}`;

      if (
        !args.username && !args.user_id
      )
        throw new Error(`Invalid username and user_id`);

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  /**:no-extract
  * @description Sessions
  */
  sessionsOpen<Response extends sessionsOpenResponse, Args extends sessionsOpenArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/sessions/open/?game_id=${args.game_id}&username=${args.username}&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  sessionsPing<Response extends sessionsPingResponse, Args extends sessionsPingArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/sessions/ping/?game_id=${args.game_id}&username=${args.username}&user_token=${args.user_token}&status=${args.status}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  sessionsCheck<Response extends sessionsCheckResponse, Args extends sessionsCheckArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/sessions/check/?game_id=${args.game_id}&username=${args.username}&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  sessionsClose<Response extends sessionsCloseResponse, Args extends sessionsCloseArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/sessions/close/?game_id=${args.game_id}&username=${args.username}&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  /**:no-extract
   * @description Data Store
   */
  dataStoreSet<Response extends dataStoreSetResponse, Args extends dataStoreSetArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/data-store/set/?game_id=${args.game_id}&key=${args.key}&data=${args.data}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_token)
        uri += `&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  dataStoreUpdate<Response extends dataStoreUpdateResponse, Args extends dataStoreUpdateArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/data-store/update/?game_id=${args.game_id}&key=${args.key}&operation=${args.operation}&value=${args.value}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_token)
        uri += `&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  dataStoreRemove<Response extends dataStoreRemoveResponse, Args extends dataStoreRemoveArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/data-store/remove/?game_id=${args.game_id}&key=${args.key}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_token)
        uri += `&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  dataStoreFetch<Response extends dataStoreFetchResponse, Args extends dataStoreFetchArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/data-store/?game_id=${args.game_id}&key=${args.key}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_token)
        uri += `&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  dataStoreGetKeys<Response extends dataStoreGetKeysResponse, Args extends dataStoreGetKeysArgs>(args: Args): Promise<Response> {
    return new Promise((resolve, reject) => {
      let uri = `${this.getBaseURI()}/data-store/get-keys/?game_id=${args.game_id}`;

      if (args.pattern)
        uri += `&pattern=${args.pattern}`;

      if (args.username)
        uri += `&username=${args.username}`;

      if (args.user_token)
        uri += `&user_token=${args.user_token}`;

      const signature = this.signature(uri + args.privateKey);

      uri += `&signature=${signature}`;

      this.send<Response>(uri)
        .then(response => resolve(response))
        .catch(error => reject(error));
    })
  }

  public existUsers(): boolean {
    return this.users.length > 0;
  }

  public getUsers(): GameJoltUser[] {
    return this.users;
  }

  public getUserById(id: number): GameJoltUser | undefined {
    return this.users.find(_user => _user.getID() === id);
  }

  public getUserByUsername(username: string): GameJoltUser | undefined {
    return this.users.find(_user => _user.getUsername() === username);
  }

  public registerUser(user: IGameJoltUser): boolean {
    try {
      if (this.getUserById(user.id))
        return false;

      this.users.push(new GameJoltUser(user));

      return true;
    } catch (error) {
      console.error(error);

      throw new Error(`Could not create the new user`);
    }
  }

  public removeUser(id: number): boolean {
    try {
      if (this.getUserById(id))
        return false;

      const index = this.users.findIndex(user => user.getID() === id);

      this.users.splice(index, 1);

      return true;
    } catch (error) {
      console.error(error);

      throw new Error(`Could not remove the user`);
    }
  }

  public connectUser(username: string, user_token: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.getUserByUsername(username))
          return reject(`User is already logged in`);

        const auth = await this.usersAuth({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username,
          user_token
        })

        if (!auth.success)
          return reject(`Username or Game Token is invalid`);

        const session = await this.sessionsOpen({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username,
          user_token
        });

        if (!session.success)
          return reject(`Unable to open a session for the user(${username})`);

        const fetch = await this.usersFetch({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username
        })

        if (!fetch.success)
          return reject(`Unable to retrieve user information(${username})`);

        const data = fetch.users[0];

        if (!data)
          return reject(`No user with the username(${username}) was found`);

        const user: IGameJoltUser = {
          id: data.id,
          type: data.type,
          username: data.username,
          token: user_token,
          avatar_url: data.avatar_url,
          status: data.status,
          last_logged_in: data.last_logged_in,
          last_logged_in_timestamp: data.last_logged_in_timestamp,
          signed_up: data.signed_up,
          signed_up_timestamp: data.signed_up_timestamp,
          developer_name: data.developer_name,
          developer_website: data.developer_website,
          developer_description: data.developer_description,
        }

        if (!this.registerUser(user))
          return reject(`Unable to register user`);

        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  public disconnectUser(username: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let user = this.getUserByUsername(username);

        if (!user)
          return reject(`User is not logged in`);

        const check = await this.sessionsCheck({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username,
          user_token: user.getToken()
        })

        if (!check.success)
          return reject(`User has no open connections`);

        const close = await this.sessionsClose({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username,
          user_token: user.getToken()
        });

        if (!close.success)
          return reject(`Unable to close user(${username}) connection`);

        if (!this.removeUser(user.getID()))
          return reject(`Could not remove the user(${username})`);

        return resolve();
      } catch (error) {
        return reject(error);
      }
    });
  }

  public update(): void {
    if (this.existUsers())
      this.getUsers().forEach(user => user.update.call(user));

    this.updateUsersSessions();
  };

  public updateUsersSessions(): void {
    if (this.existUsers()) {
      if (!this.sessionLastPingTimestamp) {
        let
          date = new Date(),
          seconds = date.getSeconds();

        date.setSeconds(seconds + this.sessionPingDelay);

        this.sessionLastPingTimestamp = date;
      } else {
        let now = new Date();

        if (now > this.sessionLastPingTimestamp)
          this.sessionLastPingTimestamp = false;

        return;
      }

      this.getUsers().forEach(async user => {
        const session = await this.sessionsCheck({
          game_id: this.game_id,
          privateKey: this.privateKey,
          username: user.getUsername(),
          user_token: user.getToken()
        })

        if (session.success) {
          const ping = await this.sessionsPing({
            game_id: this.game_id,
            privateKey: this.privateKey,
            status: user.getSessionStatus(),
            username: user.getUsername(),
            user_token: user.getToken()
          })

          if (!ping.success && user.isConnected())
            return user.disconnect();

          if (!user.isConnected())
            return user.connect();
        } else {
          if (user.isConnected())
            return user.disconnect();
        }
      });
    }
  }
}

/**:no-extract
 * @description Game Jolt User
 */

export interface IGameJoltUser {
  id: number
  username: string
  token: string
  type: gameJoltUserType
  avatar_url: string
  signed_up: string
  signed_up_timestamp: number
  last_logged_in: string
  last_logged_in_timestamp: number
  status: gameJoltUserStatus
  sessionStatus?: sessionsStatus
  developer_name: string
  developer_website: string
  developer_description: string
}

export class GameJoltUser {
  protected id: number;
  protected type: gameJoltUserType;
  protected token: string;
  protected username: string;
  protected avatar_url: string;
  protected signed_up: string;
  protected signed_up_timestamp: number;
  protected last_logged_in: string;
  protected last_logged_in_timestamp: number;
  protected status: gameJoltUserStatus;
  protected sessionStatus: sessionsStatus;
  protected developer_name: string;
  protected developer_website: string;
  protected developer_description: string;
  protected connected!: boolean;

  constructor(user: IGameJoltUser) {
    this.id = user.id;
    this.type = user.type;
    this.username = user.username;
    this.token = user.token;
    this.avatar_url = user.avatar_url;
    this.signed_up = user.signed_up;
    this.signed_up_timestamp = user.signed_up_timestamp;
    this.last_logged_in = user.last_logged_in;
    this.last_logged_in_timestamp = user.last_logged_in_timestamp;
    this.status = user.status;
    this.sessionStatus = "active";
    this.developer_name = user.developer_name;
    this.developer_website = user.developer_website;
    this.developer_description = user.developer_description;
  }

  public getID(): number {
    return this.id;
  }

  public getType(): gameJoltUserType {
    return this.type;
  }

  public getUsername(): string {
    return this.username;
  }

  public getToken(): string {
    return this.token;
  }

  public getAvatarUrl(): string {
    return this.avatar_url;
  }

  public getSignedUp(): string {
    return this.signed_up;
  }

  public getSignedUpTimestamp(): number {
    return this.signed_up_timestamp;
  }

  public getLastLoggedIn(): string {
    return this.last_logged_in;
  }

  public getLastLoggedInTimestamp(): number {
    return this.last_logged_in_timestamp;
  }

  public getStatus(): gameJoltUserStatus {
    return this.status;
  }

  public getDeveloperName(): string {
    return this.developer_name;
  }

  public getDeveloperWebsite(): string {
    return this.developer_website;
  }

  public getDeveloperDescription(): string {
    return this.developer_description;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public connect(): void {
    if (!this.isConnected())
      this.connected = true;
  }

  public disconnect(): void {
    if (this.isConnected())
      this.connected = false;
  }

  public setSessionStatus(status: sessionsStatus): void {
    this.sessionStatus = status;
  }

  public getSessionStatus(): sessionsStatus {
    return this.sessionStatus;
  }

  public isIdle(): boolean {
    return this.sessionStatus === 'idle';
  }

  public isActive(): boolean {
    return this.sessionStatus === 'active';
  }

  public update(): void {
  }
};

/*:
 *
 * @target MZ
 * @plugindesc v1.0.0 - Integration with the Game Jolt API
 * @author Dr.Xamã
 * @url https://github.com/DrXama/RPG-MAKER-MZ
 * @base DrXama_Core
 * @orderAfter DrXama_Core
 *
 * @param Game ID
 * @desc ID of your game.
 * @type string
 * @default ???
 *
 * @param Private Key
 * @desc Private key to your game.
 * @type string
 * @default ???
 *
 * @command gameJolt add
 * @text Set Text Picture
 * @desc Sets text to display as a picture.
 *       After this, execute "Show Picture" without specifying an image.
 *
 * @arg text
 * @type multiline_string
 * @text Text
 * @desc Text to display as a picture.
 *       Control characters are allowed.
 *
 * @help
 * ================================================================================
 *    DONATE
 * ================================================================================
 * https://guilhermesantos001.itch.io/
 * ================================================================================
 *    UPDATES
 * ================================================================================
 * More updates:
 * https://github.com/DrXama/RPG-MAKER-MZ
 * ================================================================================
 *    CHANGELOG
 * ================================================================================
 * v1.0.0 - Released
 * ================================================================================
 *    INTRODUCTION
 * ================================================================================
 * This plugin allows the integration of Game Jolt into your project, providing
 * full Game Jolt API support to developers.
 * ================================================================================
 *    WIKI
 * ================================================================================
 * PDF v1.0.0
 * - https://github.com/DrXama/RPG-MAKER-MZ
 * ================================================================================
 *    PLUGIN COMMANDS
 * ================================================================================
 * - GameJoltAddUser Username GameToken
 * - GameJoltLoginUser Username
 * - GameJoltLogoutUser Username
 * - GameJoltScoresAddPoints Username TableID Score ScoreLimit
 * - GameJoltScoresAddGuestPoints Guestname TableID Score ScoreLimit
 * - GameJoltTrophiesAddUser Username TrophyID
 * - GameJoltTrophiesRemoveUser Username TrophyID
 * - GameJoltOpenWindowLogin
 * - GameJoltOpenWindowLogout
 * ================================================================================
 *    SCRIPTS COMMANDS
 * ================================================================================
 * - $gameTemp.gameJoltAddUser(username, gametoken);
 * - $gameTemp.gameJoltLoginUser(username, callback);
 * - $gameTemp.gameJoltLogoutUser(username, callback);
 * - $gameTemp.gamejoltScoresUserTable(username, tableID, callback);
 * - $gameTemp.gamejoltScoresTables(callback);
 * - $gameTemp.gamejoltScoresAddPoints(username, tableID, score, sort, callback);
 * - $gameTemp.gamejoltScoresAddGuestPoints(guestname, tableID, score, sort, callback);
 * - $gameTemp.gamejoltScoresGetRankTables(tableID, sort, callback);
 * - $gameTemp.gamejoltTrophiesUser(username, trophyId, achieved, callback);
 * - $gameTemp.gamejoltTrophiesAddUser(username, trophyId, callback);
 * - $gameTemp.gamejoltTrophiesRemoveUser(username, trophyId, callback);
 * - $gameTemp.gameJoltOpenWindowLogin();
 * - $gameTemp.gameJoltOpenWindowLogout();
 * ================================================================================
 */

(() => {
  "use strict";

  //-----------------------------------------------------------------------------
  // DrXama Core
  //
  let win: any = window,
    pluginManagerParameters = win.DX.PluginManagerParameters,
    gameTemp = win.DX.Game_Temp,
    sceneUpdateCallbacks = win.DX.SceneUpdateCallbacks;

  //-----------------------------------------------------------------------------
  // Parameters
  //
  const params = pluginManagerParameters('DrXama_GameJolt'),
    game_id = String(params['Game ID']) || "",
    privateKey = String(params['Private Key']) || "";

  //-----------------------------------------------------------------------------
  // Variables
  //
  const gameJolt = new GameJolt(game_id, privateKey);

  sceneUpdateCallbacks.push([gameJolt.update, gameJolt]);

  gameTemp.testing = () => 'Hello World';

  gameJolt.connectUser("DrXama", "20hab100v71zex")
    .then(() => {
      console.log('DrXama connected');
    })
    .catch(error => console.log(error));
})();
