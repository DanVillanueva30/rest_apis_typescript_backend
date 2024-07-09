import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
    tableName: "Products"
})
class Product extends Model {
    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare name: string

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare price: number
    
    @Default(true)
    @Column({
        type: DataType.BOOLEAN
    })
    declare availability: boolean
}

export default Product;