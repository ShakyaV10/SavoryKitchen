import { useEffect, useState, useCallback } from "react";
import styled from 'styled-components';
import { useParams } from "react-router-dom";

import React from 'react'

function Recipe() {

    let params = useParams();
    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("summary");

    const toggleTab = (tab) => {
        setActiveTab((prevTab) => (prevTab === tab ? "summary" : tab));
    };

    const fetchDetails = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);

        const data = await fetch(
            `https://api.spoonacular.com/recipes/${params.name}/information?apiKey=${process.env.REACT_APP_API_KEY}`
        );

        if (!data.ok) {
            setError("Failed to fetch data.");
            return;
        }

        const detailData = await data.json();
        setDetails(detailData);
        console.log(detailData);
        setLoading(false);
        } catch (error) {
        setError("An error occurred while fetching data.");
        setLoading(false);
        }
    }, [params.name]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <DetailWrapper>
            <div>
                <h2>{details.title}</h2>
                <img src={details.image} alt="" />
            </div>
            <Info>
                <Button
                className={activeTab === "instructions" ? "active" : ""}
                onClick={() => toggleTab("instructions")}
                >
                Instructions
                </Button>
                <Button
                className={activeTab === "ingredients" ? "active" : ""}
                onClick={() => toggleTab("ingredients")}
                >
                Ingredients
                </Button>
                {activeTab === "summary" && (
                <div>
                    <p dangerouslySetInnerHTML={{ __html: details.summary }}></p>
                </div>
                )}
                {activeTab === "instructions" && (
                <div>
                    <p dangerouslySetInnerHTML={{ __html: details.instructions }}></p>
                </div>
                )}
                {activeTab === "ingredients" && (
                <ul>
                    {details.extendedIngredients.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.original}</li>
                    ))}
                </ul>
                )}
            </Info>
        </DetailWrapper>
    );
}

const DetailWrapper = styled.div`
    margin: 10rem inherit 5rem;
    margin-left: -15rem;
    display: flex;

    @media (max-width: 1068px) {
        flex-direction: column;
    }

    .active {
        background: linear-gradient(35deg, #494949, #313131);
        color: #fff;
    }

    h2 {
        margin-bottom: 2rem;
    }

    ul {
        margin-top: 2rem;
    }

    li {
        text-decorations: none;
        font-size: 1rem;
        line-height: 2rem;
    }

    p {
        text-decorations: none;
        margin: 1rem 0;
        font-size: 1rem;
        line-height: 1.5rem;

        &:first-child {
            margin-top: 2rem;
        }
    }
`;

const Button = styled.button`
    padding: 1rem 2rem;
    color: #313131;
    background: white;
    border: 2px solid black;
    margin-right: 1rem;
    font-weight: 600;
`;

const Info = styled.div`
    margin-left: 2rem;
    @media (max-width: 1068px) {
        margin-top: 3rem;
        margin-left: 1rem;
    }
`;

export default Recipe