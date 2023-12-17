import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState, useContext} from 'react';
import styles from './productDetail.style';
import Ionicon from 'react-native-vector-icons/Ionicons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-reanimated-carousel';
import {COLORS, SIZES} from '../../constants';
import axios from 'axios';
import {userContext} from '../../Context/UserContext';
import {cartContext} from '../../Context/CartContext';
import Ip from '../../constants/ipAddress';
import CustomButton from '../../components/CustomButton/CustomButton';
import LinearGradient from 'react-native-linear-gradient';
import ProductRow from '../../components/products/ProductRow/ProductRow';
import {productsContext} from '../../Context/ProductContext';
import Rating from '../../components/Rating/Rating';
const ProducDetail = ({navigation, route}) => {
  const [count, setCount] = useState(1);
  const [packingIndex, setPackingIndex] = useState(0);
  ////////
  const {products, isLoadingProducts} = useContext(productsContext);
  const arr = [products[0], products[0], products[0], products[0], products[0]];
  const increase = () => {
    count < 5 ? setCount(count + 1) : null;
  };
  const decrease = () => {
    count > 0 ? setCount(count - 1) : null;
  };
  const {product} = route.params;
  const {userId} = useContext(userContext);
  const {FetchCart, setCartData} = useContext(cartContext);

  const addToCart = async (id, price) => {
    console.log(id);

    await axios
      .post(`http://${Ip}:3000/addcart/${userId}`, {productId: id})
      .then(response => {
        Alert.alert('Success', 'Addresses added successfully');
        setCartData({cart: response.data.cart, isLoadingCart: false});
      })
      .catch(error => {
        console.log(error);
      });
  };
  const addItemToCart = product => {
    addToCart(product._id);
    setTimeout(() => {
      // setAddedToCart(false);
    }, 5000);
  };
  return (
    <View style={styles.main}>
      <View style={styles.upperRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicon name="chevron-back-circle" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.goToCartBtn}
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <Ionicon name="cart-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.galeryContainer}>
            <Carousel
              // pagingEnabled={false}
              onConfigurePanGesture={gestureChain =>
                gestureChain.activeOffsetY([-1, 1])
              }
              loop
              width={SIZES.width}
              height={280}
              autoPlay={false}
              data={product.imageUrl}
              scrollAnimationDuration={1000}
              // onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({item}) => (
                <View style={styles.galeryItem}>
                  <Image style={styles.img} source={{uri: item}} />
                </View>
              )}
            />
          </View>
          <View style={styles.detail}>
            <View style={styles.locationWrapper}>
              <View style={styles.location}>
                <View style={styles.locationRow}>
                  <Ionicon
                    name="location-outline"
                    size={20}
                    color={COLORS.red}
                  />
                  <View style={styles.locationTxt}>
                    <Text style={styles.locationTxt}>
                      {product.product_location}
                    </Text>
                  </View>
                </View>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcon
                    name="truck-delivery-outline"
                    size={20}
                    color={COLORS.red}
                  />
                  <View style={styles.deliveryTxt}>
                    <Text style={styles.locationTxt}>Standard Delivery</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{product.title}</Text>
            </View>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <Rating rating={product.rating} />
                <Text style={styles.ratingText}>({product.rating})</Text>
              </View>
              <View style={styles.packingOptionContainer}>
                {product.packing.map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setPackingIndex(index)}
                    style={styles.packingOptionBtn(index == packingIndex)}>
                    <Text
                      style={styles.packingOptionText(index == packingIndex)}>
                      {item.unit}
                    </Text>
                  </Pressable>
                ))}

                {/* <Pressable
                  onPress={() => setPackingIndex(1)}
                  style={styles.packingOptionBtn(1 == packingIndex)}>
                  <Text style={styles.packingOptionText(1 == packingIndex)}>
                    {product.packing.unit}
                  </Text>
                </Pressable> */}
              </View>
            </View>
            <View style={styles.priceRow}>
              {product.packing[packingIndex].discount == 0 ? (
                <Text style={styles.price}>
                  ${product.packing[packingIndex].price}
                </Text>
              ) : (
                <View style={styles.priceFlex}>
                  <Text style={styles.priceBefore}>
                    ${product.packing[packingIndex].price}
                  </Text>
                  <Text style={styles.priceAfter}>
                    $
                    {product.packing[packingIndex].price -
                      (product.packing[packingIndex].price *
                        product.packing[packingIndex].discount) /
                        100}
                  </Text>
                </View>
              )}
              <View style={styles.counter}>
                <Text style={styles.counterTitle}>Quantity: </Text>
                <TouchableOpacity onPress={() => decrease()}>
                  <SimpleLineIcon name="minus" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.counterText}>{count}</Text>
                <TouchableOpacity onPress={() => increase()}>
                  <SimpleLineIcon name="plus" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cartRow}>
              {/* <TouchableOpacity style={styles.cartBtn} onPress={() => {}}>
                <Text style={styles.cartTitle}>BUY NOW</Text>
              </TouchableOpacity> */}
              <CustomButton text={'BUY NOW'} widh={160} height={40} />
              <TouchableOpacity
                style={styles.addCart}
                onPress={() => addItemToCart(product)}>
                <LinearGradient
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.addCart}>
                  <FontAwesome5
                    name="cart-arrow-down"
                    size={20}
                    color={COLORS.lightWhite}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.descWraper}>
              <Text style={styles.desc}>Description</Text>
              <Text style={styles.descText}>{product.description}</Text>
            </View>
            <View style={styles.relatedWraper}>
              <Text style={styles.relatedTitle}>Related Offer</Text>
              <ProductRow
                scale={0.8}
                products={arr}
                isLoadingProducts={isLoadingProducts}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProducDetail;

// <View style={styles.priceWrapper}>
//             <Text style={styles.price}>${product.price}</Text>
//           </View>
