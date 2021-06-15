import request from 'request-promise';
import { IApp, IAppListResponse, IGameDetail, IGameDetailResponse, IGameDetails, IPriceOverview } from './types';

export class SteamWebAPI {
    private static readonly STEAM_API_URL = 'https://api.steampowered.com';
    private static readonly STEAM_APPS_INTERFACE = 'ISteamApps';
    private static readonly STEAM_API_VERSION = 'v2';
    private static readonly STEAM_API_APP_LIST_ENDPOINT = 'GetAppList';

    private static readonly STEAM_STORE_API_URL = 'https://store.steampowered.com/api';
    private static readonly STEAM_STORE_API_APP_DETAILS_ENDPOINT = 'appdetails';


    public static async getAppList(): Promise<IApp[]> {
        const url = SteamWebAPI.buildApiUrl(SteamWebAPI.STEAM_API_APP_LIST_ENDPOINT);
        const { applist: { apps }}: IAppListResponse = await request({ url, method: 'GET', json: true });
        return apps;        
    }

    private static buildApiUrl(endpoint: string): string {
        return  `${SteamWebAPI.STEAM_API_URL}/${SteamWebAPI.STEAM_APPS_INTERFACE}/${endpoint}/${SteamWebAPI.STEAM_API_VERSION}/`
    }

    public static async getGameDetails(appIds: number[]): Promise<IGameDetails> {
        const promises = appIds.map(this.getGameDetail);
        const response = await Promise.all(promises);
        return response.filter((res) => Boolean(res));
    }

    public static async getGameDetail(appId: number): Promise<IGameDetail> {
        const url = SteamWebAPI.buildStoreApiUrl(SteamWebAPI.STEAM_STORE_API_APP_DETAILS_ENDPOINT);
        const response: IGameDetailResponse = await request({ url, method: 'GET', qs: { appids: appId }, json: true });
        return response[appId].data;
    }

    public static async getPricingForGames(appIds: number[]): Promise<IGameDetail[]> {
        const url = SteamWebAPI.buildStoreApiUrl(SteamWebAPI.STEAM_STORE_API_APP_DETAILS_ENDPOINT);
        const response: IGameDetailResponse = await request({ url, method: 'GET', qs: { appids: appIds, filters: 'price_overview' }, json: true });
        return Object.keys(response).map((appId) => ({
            steam_appid: +appId,
            price_overview: response[appId].data.price_overview
        }))
    }

    private static buildStoreApiUrl(endpoint: string): string {
        return `${this.STEAM_STORE_API_URL}/${endpoint}`;
    }
}