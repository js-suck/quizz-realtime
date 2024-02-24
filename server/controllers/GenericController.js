

function GenericController(service, options = {}) {

    async function getAll(req, res) {
        const {
            _page = 1,
            _itemsPerPage = 100,
            _sort = {},
            ...criteria
        } = req.query;

        const objects = await service.findAll(criteria, {
            itemsPerPage: _itemsPerPage,
            page: _page,
            order: _sort,
        });
        res.json(objects);
    }

    async function getAllBy(req, res) {
        const objects = await service.findAllBy(req.params.categoryId);
        if (!objects) {
            res.sendStatus(404);
        } else {
            res.json(objects);
        }
    }

    async function create(req, res, next) {
        try {
            const object = await service.create(req.body);
            res.status(201).json(object);
        } catch (error) {
            next(error);
        }
    }

    async function getOne(req, res) {
        const object = await service.findOne(parseInt(req.params.id, 10));
        if (!object) {
            res.sendStatus(404);
        } else {
            res.json(object);
        }
    }

    async function getByName(req, res) {
        const entity = await service.findByName(req.params.category);
        if (!entity) {
            res.sendStatus(404);
        } else {
            res.json(entity);
        }
    }

    async function replace(req, res, next) {
        try {
            const [object, created] = await service.replaceOne(
                parseInt(req.params.id, 10),
                req.body
            );

            if (!object) {
                res.sendStatus(404);
            } else res.status(created ? 201 : 200).json(object);
        } catch (error) {
            next(error);
        }
    }

    async function createOrIncrement(req, res, next) {
        console.log('req.body', req.body);
        try {
            const [object, created] = await service.createOrIncrement(
                req.body
            );

            if (!object) {
                res.sendStatus(404);
            } else {
                res.status(created ? 201 : 200).json(object);
            }
        } catch (error) {
            next(error);
        }
    }

    async function update(req, res, next) {
        try {
            const object = await service.updateOne(
                parseInt(req.params.id, 10),
                req.body
            );
            if (!object) {
                res.sendStatus(404);
            } else res.json(object);
        } catch (error) {
            next(error);
        }
    }

    async function deleteOne(req, res) {
        const deleted = await service.deleteOne(parseInt(req.params.id, 10));
        if (!deleted) {
            res.sendStatus(404);
        } else res.sendStatus(204);
    }





    return {
        create,
        deleteOne,
        getAll,
        getByName,
        getOne,
        replace,
        update,
        createOrIncrement,
    };
}

module.exports = GenericController;