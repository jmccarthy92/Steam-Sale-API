import Objection, { Model, PartialModelObject } from 'objection';

export default class Service<DataModel extends Model> {
    protected readonly SELECT_ALL = '*';
    private model: Objection.ModelClass<any>;

    constructor(model: Objection.ModelClass<any>) {
        this.model = model;
    }

    public get(fields: string[] = [this.SELECT_ALL]): Objection.QueryBuilder<DataModel> {
        return this.query().select(fields);
    }

    public insert(data: PartialModelObject<DataModel>): Objection.QueryBuilder<DataModel, DataModel> {
        return this.query().insert(data);
    }

    public update(id: number, data: PartialModelObject<DataModel>): Objection.QueryBuilder<DataModel, DataModel> {
        return this.query().patchAndFetchById(id, data);
    }

    public query(): Objection.QueryBuilder<DataModel> {
        return this.model.query()
    }
    

}