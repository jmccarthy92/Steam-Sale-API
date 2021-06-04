import dotenv from 'dotenv';
import commandLineArgs, { CommandLineOptions } from 'command-line-args';


export default class EnvironmentLoader {
    private static options: CommandLineOptions;

    public static loadEnvironmentFile(): void {
        EnvironmentLoader.setupCommandLineOptions();
        const { env } = EnvironmentLoader.options;
        let error: Error | undefined;
        if (process.env.NODE_ENV !== 'production') {
            error =  dotenv.config({ path: `./env/${env}.env` }).error; 
        }
        if(error) throw error;
    }

    private static setupCommandLineOptions(): void {
        EnvironmentLoader.options = commandLineArgs([
            {
                name: 'env',
                alias: 'e',
                defaultValue: 'production',
                type: String,
            },
        ]);
    }

}
