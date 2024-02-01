import { ReactNode, createContext, useState } from "react"

import { ProductProps } from "../pages/Home"

interface CartContextData {
    cart: CartProps[]
    cartAmount: number
    addItemCart: (newItem: ProductProps) => void
    removeItemCart: (product: CartProps) => void
    total: string
}

interface CartProps {
    id: number
    title: string
    description: string
    price: number
    cover: string
    amount: number
    total: number
}

interface CartProviderProps {
    children: ReactNode
}

export const CartContext = createContext({} as CartContextData)

function CartProvider({ children }: CartProviderProps) {

    const [cart, setCart] = useState<CartProps[]>([])
    const [total, setTotal] = useState('')

    // console.log("SETCART", setCart)

    function addItemCart(newItem: ProductProps) {
        const indexItem = cart.findIndex(item => item.id === newItem.id)

        if (indexItem !== -1) {
            const cartList = cart

            cartList[indexItem].amount = cartList[indexItem].amount + 1
            cartList[indexItem].total = cartList[indexItem].amount * cartList[indexItem].price

            setCart(cartList)
            totalResultCart(cartList)
            return
        }

        const data = {
            ...newItem,
            amount: 1,
            total: newItem.price
        }

        setCart(products => [...products, data])
        totalResultCart([...cart, data])
        // console.log("SETCARTproducts", setCart)
        // console.log("CARTproducts", cart)
    }

    function removeItemCart(product: CartProps) {

        const indexItem = cart.findIndex(item => item.id === product.id)

        if(cart[indexItem]?.amount > 1) {
            console.log("CARTindexItem", cart[indexItem])
            const cartList = cart
            
            cartList[indexItem].amount = cartList[indexItem].amount -1
            cartList[indexItem].total = cartList[indexItem].total - cartList[indexItem].price
            
            setCart(cartList)
            totalResultCart(cartList)
            return
        }

        const removeItem = cart.filter(item => item.id !== product.id)
        setCart(removeItem)
        totalResultCart(removeItem)
        console.log("REMOVE", removeItem)
    }

    function totalResultCart(items: CartProps[]) {
        const myCart = items
        const result = myCart.reduce((acc, obj) => { return acc + obj.total}, 0)
        const resultFormated = result.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        setTotal(resultFormated) 
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                cartAmount: cart.length,
                addItemCart,
                removeItemCart,
                total
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider