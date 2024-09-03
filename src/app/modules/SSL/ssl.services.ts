import axios from "axios";
import httpStatus from "http-status";
import { IPaymentData } from "./ssl.interface";
import ApiError from "../../erros/ApiError";

const initPayment = async (paymentData: IPaymentData) => {
    try {
        const data = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASS,
            total_amount: paymentData.amount,
            currency: "BDT",
            tran_id: paymentData.transactionId, // use unique tran_id for each api call
            success_url: process.env.SUCCESS_URL,
            fail_url: process.env.FAIL_URL,
            cancel_url: process.env.CANCEL_URL,
            ipn_url: "http://localhost:3030/ipn",
            shipping_method: "N/A",
            product_name: "Appointment",
            product_category: "Service",
            product_profile: "general",
            cus_name: paymentData.name,
            cus_email: paymentData.email,
            cus_add1: paymentData.address,
            cus_add2: "N/A",
            cus_city: "N/A",
            cus_state: "N/A",
            cus_postcode: "N/A",
            cus_country: "Bangladesh",
            cus_phone: paymentData.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };

        const response = await axios({
            method: "post",
            url: process.env.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        return response.data;
    } catch (err) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Payment erro occured!");
    }
};

const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${process.env.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${process.env.STORE_ID}&store_passwd=${process.env.STORE_PASS}&format=json`,
        });

        return response.data;
    } catch (err) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Payment validation failed!"
        );
    }
};

export const SSLService = {
    initPayment,
    validatePayment,
};
