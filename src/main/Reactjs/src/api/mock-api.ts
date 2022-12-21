import { AxiosResponse } from 'axios';
import { PageableResponse } from '../model/pageable';

/**
 * @author Deividi Cavarzan
 * Class for mock API responsed based con a json paylod loaded from project import
 * Example where `Entity` is the class type and `jsonContent` is the json value itself:
 *
 *  ```
 *       import jsonContent from '../../Util/mocks/myjson.json';
 *       // ... somewhere you will return the mock as:
 *       return new Mocker<Entity>().mock(jsonContent, Entity);
 * ```
 *
 * @export
 * @class Mocker
 * @template T type of the entity
 */
export default class Mocker<T> {
    mock = (payload: JsonPayloadType<T>) => {
        return new Promise<AxiosResponse<T>>((resolveFunction) => {
            return resolveFunction({
                data: payload as T,
                status: 200
            } as AxiosResponse<T>);
        });
    };
}

export interface JsonPayloadType<T> extends Partial<Omit<PageableResponse<T>, 'content'>> {
    content?: T[] | any;
}
