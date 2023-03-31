import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const FormSuccess = (props) => {
    const buttonClicked = ()=>{
        if(props.error){
            //close the overlay
            props.errorBtn();
        }else{
            // 
            props.successBtn();
        }
    }

    return (
        <>
            <View style={styles.popUp}>
                {
                    props.error ? 
                    <Image style={{width: 72, height: 72, resizeMode:'contain'}} source={require('../../assets/img/error.png')}/>
                    :
                    <Image style={{width: 72, height: 72, resizeMode:'contain'}} source={require('../../assets/img/check.png')}/>
                }

                <Text style={{textAlign: 'center', marginTop: 10}}>
                    {props.text}
                </Text>

                <TouchableOpacity onPress={()=>buttonClicked()} style={{width:'80%', height:52, backgroundColor:"black", borderRadius:10, marginTop:10, justifyContent:'center', alignItems:'center'}}>
                    <Text style={{color: "white"}}>Okay</Text>
                </TouchableOpacity>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    popUp: {
        width: 300,
        height: 300,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
    }
});

export default FormSuccess