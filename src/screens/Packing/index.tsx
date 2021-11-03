import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import styles from './styles';
import {View} from 'react-native';
import showPopup from '../../components/Popup';
import InputBox from '../../components/InputBox';
import {hideScreenLoading} from '../../redux/actions/main';
import useEventListener from "../../hooks/useEventListener";
import {searchProductGloballyAction} from "../../redux/actions/products";
import Button from "../../components/Button"
import {getShipmentPacking, getContainerDetails, submitShipmentDetails} from "../../redux/actions/packing";


const Packing = () => {
    const barcodeData = useEventListener();
    const dispatch = useDispatch();
    const [state, setState] = useState<any>({
        product: "",
        productCode: "",
        shipmentNumber: "",
        lpnNumber: "",
        quantityUnpacked: "0",
        quantityToPack: "0",
        error: null,
        searchProductCode: null,
        containerId: "",
        shipmentDetails: null,
        shipmentId:"ff8081817c6fb108017c709dde9a000c"
    })

    useEffect(() => {
        getShipmentDetails()
    }, [])


    useEffect(() => {
        if (barcodeData && Object.keys(barcodeData).length !== 0) {
            onBarCodeScanned(barcodeData.data)
        }
    }, [barcodeData])

    const showErrorPopup = (data: any, query: any, actionCallback: any, searchBarcode: any) => {
        showPopup({
            title: data.error.message
                ? `Failed to load search results with value = "${query}"`
                : null,
            message:
                data.error.message ??
                `Failed to load search results with value = "${query}"`,
            positiveButton: {
                text: 'Retry',
                callback: () => {
                    dispatch(searchBarcode(query, actionCallback));
                },
            },
            negativeButtonText: 'Cancel',
        });
    }
    const onBarCodeScanned = (query: string) => {
        // handleBarcodeScan(barcodeNo);
        if (!query) {
            showPopup({
                message: 'Search query is empty',
                positiveButton: {text: 'Ok'},
            });
            return;
        }
        if (query.includes("LOG-XXX")) {
            const actionCallback = (data: any) => {
                if (data?.error) {
                    showErrorPopup(data, query, actionCallback, searchProductGloballyAction)
                } else {
                    console.log(data)
                    if (data.length == 0) {
                        showPopup({
                            message: `No search results found for product name "${query}"`,
                            positiveButton: {text: 'Ok'},
                        });
                    } else {
                        if (data && Object.keys(data).length !== 0) {
                            if (state.productCode === "" || state.productCode === data.data[0].productCode) {
                                state.product = data.data[0];
                                state.quantity = (parseInt(state.quantity, 10) + 1).toString();
                            } else {
                                showPopup({
                                    message: `You have scanned a wrong product barcode "${query}"`,
                                    positiveButton: {text: 'Ok'},
                                });
                            }
                            setState({...state})
                        }
                    }
                    dispatch(hideScreenLoading());
                }
            };
            dispatch(searchProductGloballyAction(query, actionCallback));
        }
    }

    const getShipmentDetails = (id: string = "250SMG") => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Shipment details`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load Shipment details value ${id}`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getShipmentPacking(id, callback));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    console.log(data)
                    state.shipmentDetails = data[0]
                    state.shipmentNumber = data[0].shipmentNumber
                    state.containerId = data[0].id
                    getContainerDetail(data[0].id)
                }
                setState({...state})
            }
        }
        dispatch(getShipmentPacking(id, callback))
    }


    const getContainerDetail = (id: string = "") => {
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Container details`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to load Container details value ${id}`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(getContainerDetails(id));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    console.log(data);
                    submitShipmentDetail(state.shipmentId)
                }
            }
        }
        dispatch(getContainerDetails(id))
    }


    const submitShipmentDetail = (id: string) => {
        const request = {
            "container.id": state.containerId
        }
        const callback = (data: any) => {
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Shipment details`
                        : null,
                    message:
                        data.error.message ??
                        `Failed to submit shipment details`,
                    positiveButton: {
                        text: 'Retry',
                        callback: () => {
                            dispatch(submitShipmentDetails(id, request));
                        },
                    },
                    negativeButtonText: 'Cancel',
                });
            } else {
                if (data && Object.keys(data).length !== 0) {
                    console.log(data);

                }
                setState({...state})
            }
        }
        dispatch(submitShipmentDetails(id, request))
    }
    const onChangeLPNNumber = (text: string) => {
        setState({...state, quantityUnpacked: text})
    }

    const onChangeQuantityPacked = (text: string) => {
        setState({...state, quantityToPack: text})
    }

    const onChangeProductCode = (text: string) => {
        setState({...state, productCode: text})
    }

    const onChangeShipmentNumber = (text: string) => {
        setState({...state, shipmentNumber: text})

    }

    const moveToLPN = () => {

    }

    return (
        <View style={styles.container}>
            <View style={styles.from}>
                <InputBox
                    label={'Shipment Number'}
                    value={state.shipmentNumber}
                    onChange={onChangeShipmentNumber}
                    disabled={true}
                    editable={true}/>
                <InputBox
                    label={'LPN'}
                    value={state.lpnNumber}
                    onChange={onChangeLPNNumber}
                    disabled={true}
                    editable={true}/>
                <InputBox
                    value={state.product.productCode}
                    disabled={true}
                    editable={true}
                    onChange={onChangeProductCode}
                    label={'Product Code'}/>
                <InputBox
                    value={state.quantityUnpacked}
                    label={'Quantity unpacked'}
                    disabled={true}
                    editable={false}
                />
                <InputBox
                    value={state.quantityToPack}
                    disabled={true}
                    editable={true}
                    onChange={onChangeQuantityPacked}
                    label={'Quantity to Pack'}/>

            </View>
            <View style={styles.bottom}>
                <Button
                    title="Move to LPN"
                    onPress={moveToLPN}
                />
            </View>
        </View>
    );
}


export default Packing;
