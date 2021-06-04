
export interface IAppListResponse {
    applist: IAppList
}

interface IAppList {
    apps: IApp[]
}

export interface IApp {
    appid: number;
    name: string;
}

export interface IGameDetailResponse {
    [key: string]: { 
        success: boolean;
        data: IGameDetail;
   }
}

export interface IGameDetail {
    type?: string;
    name?: string;
    steam_appid?: number;
    required_age?: number;
    is_free?: boolean,
    detailed_description?: string;
    about_the_game?: string;
    short_description?: string;
    fullgame?: any;
    supported_languages?: string;
    header_image?: string;
    website?: string;
    pc_requirements?: any;
    mac_requirements?: any;
    linux_requirements?: any;
    legal_notice?: string;
    developers?: string[];
    publishers?: string[];
    price_overview?: IPriceOverview;
    packages?: number[];
    package_groups?: any[];
    platforms?: any;
    categories?: any;
    genres?: any;
    screenshots?: any;
    release_date?: any;
    support_info?: any;
    background?: string;
    content_descriptors?: any;
}

export interface IPriceOverview {
    currency: string;
    initital: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
}