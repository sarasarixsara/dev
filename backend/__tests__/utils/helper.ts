import {Business} from "../../src/models/Business";
import {AppService} from "../../src/models/AppService";

export async function initServices(): Promise<{business:Business, service:AppService}>
{
    const business = await Business.getModel<typeof Business>().findOne({
        where: {
            domain: 'test.ingenio.com.co'
        }
    })

    if (business === null) {
        throw new Error('Missing test business')
    }

    const service = await AppService.getModel<typeof AppService>().findOne({
        where: {
            name: 'api'
        }
    })

    if (service === null) {
        throw new Error('Missing service auth')
    }

    return {
        business,
        service
    }
}