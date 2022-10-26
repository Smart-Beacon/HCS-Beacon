const Door =  require('../db/models/door');
const Statement = require('../db/models/statement');
const AdminStatement = require('../db/models/adminStatement');
const AdminDoor = require('../db/models/adminDoor');

const getStatementOfSuper = async() => {
    const result = await Statement.findAll({
        attributes:['staId','staName']
    });

    return result;
};

const getDoorOfSuper = async() => {
    const doorData = await Door.findAll({
        attributes:['doorId','doorName','staId']
    });

    return doorData;
}

const getStatementOfAdmin = async(id) => {
    const staIds = await AdminStatement.findAll({
        where:{adminId:id},
        attributes:['staId']
    });

    const result = Promise.all(
        staIds.map(async staId => {
            const staData = await Statement.findOne({
                where:{staId:staId.staId},
                attributes:['staId','staName']
            });
            return staData;
        })
    );
    
    return result;
};

const getDoorOfAdmin = async(id) => {
    const doorIds = await AdminDoor.findAll({
        where:{adminId:id},
        attributes:['doorId']
    });

    const result = Promise.all(
        doorIds.map(async doorId => {
            const doorData = await Door.findOne({
                where:{doorId:doorId.doorId},
                attributes:['doorId','doorName','staId']
            });

            return doorData;
        })
    );

    return result;
}


module.exports = {
    getStatementOfSuper,
    getStatementOfAdmin,
    getDoorOfSuper,
    getDoorOfAdmin,
}
