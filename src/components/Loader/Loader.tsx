import React from "react";
import { ColorRing } from "react-loader-spinner";

interface IPropsLoader {}

const Loader: React.FC<IPropsLoader> = ({}) => {
    return (
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}} className="">
            <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
        </div>
    );
};

export default Loader;
