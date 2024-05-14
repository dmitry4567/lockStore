import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEnitity } from 'src/user/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Repository } from 'typeorm';
import { AddProductToCartDto } from './dto/addProductToCart.dto';
import { ProductsService } from 'src/products/products.service';
import { CartItem } from './entities/cartItem.entitiy';
import { UpdateProductToCartDto } from './dto/updateProductToCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductsService,
  ) {}

  async createCart(user: UserEnitity): Promise<Cart> {
    const cart = new Cart();
    cart.user = user;
    await this.cartRepository.save(cart);
    return cart;
  }

  async getUserCartTotalPrice(userId: number): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } }, // Replace with your retrieval criteria
      relations: ['cartItems', 'cartItems.product'], // Include related entities
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for user with ID: ' + userId);
    }

    return cart.getTotalPrice();
  }

  async addProductToCart(dto: AddProductToCartDto, user: any) {
    const product = await this.productService.getProductById(dto.productId);

    if (!product) {
      throw new NotFoundException(
        'There is no product with this ID: ' + dto.productId,
      );
    }

    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user,
      },
    });

    userCart.cartItems.forEach((x) => x.product.title);

    if (userCart.cartItems.some((x) => x.product.id == product.id)) {
      const cItem = userCart.cartItems.find((x) => x.product.id == product.id);
      cItem.Quantity += +dto.quantity;
      cItem.priceProduct = cItem.product.price * cItem.Quantity;
      return await this.cartItemRepository.save(cItem);
    }

    const cartItem = this.cartItemRepository.create({
      product: product,
      Quantity: +dto.quantity,
      priceProduct: product.price * dto.quantity,
    });
    cartItem.cart = userCart;

    return await this.cartItemRepository.save(cartItem);
  }

  async findAll(user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: {
            photoItems: true,
          },
        },
      },
      where: {
        user: user.id,
      },
    });

    const data = userCart.cartItems;

    const totalPrice = await this.getUserCartTotalPrice(user.id);

    throw new HttpException({ totalPrice, data }, HttpStatus.OK);
  }

  async findOne(productId: number, user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const product = userCart.cartItems.find((x) => x.id == productId);

    if (!product) {
      throw new NotFoundException(
        'Cart does not have product ID: ' + productId,
      );
    }

    return product;
  }

  async getUserBasket(user: any) {
    const userBasket = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user,
      },
    });
    return userBasket;
  }

  async UpdateProductFromCart(dto: UpdateProductToCartDto, user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const cartItem = await this.cartItemRepository.findOne({
      relations: {
        cart: true,
        product: true,
      },
      where: {
        product: await this.productService.getProductById(dto.productId),
        cart: userCart,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        'There is no product with this ID: ' + dto.productId,
      );
    }

    cartItem.Quantity = dto.quantity;
    cartItem.priceProduct = dto.quantity * cartItem.product.price;

    if (cartItem.Quantity == 0) {
      return await this.cartItemRepository.remove(cartItem);
    }

    const data = await this.cartItemRepository.save(cartItem);

    const updateTotalPrice = await this.getUserCartTotalPrice(user.id);

    throw new HttpException({ updateTotalPrice, data }, HttpStatus.OK);
  }

  async remove(productId: number, user: any): Promise<DeleteResult> {
    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user.id,
      },
    });

    const cartItem = await this.cartItemRepository.findOne({
      relations: {
        cart: true,
        product: true,
      },
      where: {
        product: await this.productService.getProductById(productId),
        cart: userCart,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(
        'There is no product with this ID: ' + productId,
      );
    }

    return await this.cartItemRepository.delete(cartItem);
  }

  async removeCartItems(user: any) {
    const userCart = await this.cartRepository.findOne({
      relations: {
        cartItems: {
          product: true,
        },
      },
      where: {
        user: user,
      },
    });

    if (!userCart) {
      throw new NotFoundException();
    }

    await this.cartItemRepository
      .createQueryBuilder()
      .delete()
      .where('cartId = :cartId', { cartId: userCart.id })
      .execute();

    userCart.cartItems = [];

    return await this.cartRepository.save(userCart);
  }
}
