import { useEffect, useState} from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../index';
import styled from "styled-components/macro";
import CampaignCard from "./CampaignCard";
import Error from "../Error/Error";
import Loader from "../Loader/Loader";

const StyledExplore = styled.main`
    margin: 0 auto;
    max-width: 1000px;
    padding-top: 75px;
    padding-bottom: 100px;

    ul {
        display: grid;
        grid-template-columns: repeat( auto-fill, minmax(251px, 1fr));
        grid-gap: 1rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    li {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04), 0 3px 10px rgba(0, 0, 0, 0.04);
    }

    h1 {
        margin: 1rem 0;
    }

    form {
        margin-bottom: 1rem;
    }

    input {
        border: 1px solid var(--border-color);
        border-radius: 2rem;
        outline: none;
        font-size: 1rem;
        text-indent: 0.5rem;
        padding: 0.75rem;
        margin-right: 0.5rem;
        width: 100%;
        max-width: 250px;
        
        &:focus {
            border-color: var(--border-hover);
        }
    }

    button {
        width: fit-content;
        display: inline-block;
        padding: 0 1.5rem;
        margin-top: 1rem;
    }

    @media (min-width: 768px) {
        input {
            max-width: 300px;
            text-indent: 0.5rem;
        }

        button {
            margin-top: 0;
        }
    }
`;

const ExploreView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [campaignsList, setCampaignsList] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const getCampaigns = async (searchTerm) => {
        setIsLoading(true);
        const activeCampaignsList = [];
        const querySnapshot = await getDocs(collection(db, "campaigns"));
        
        querySnapshot.forEach((doc) => {
            const campaignData = doc.data();
            if (campaignData.name && campaignData.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                activeCampaignsList.push(campaignData);
            }
        });

        setCampaignsList(activeCampaignsList);
        setIsLoading(false);
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearch = (e) => {
        e.preventDefault();
        getCampaigns(searchTerm);
    }

    useEffect(() => {
        try {
            getCampaigns(searchTerm);
        }
        catch (error) {
            setError(error.message);
        }
    }, []);

    if (!isLoading && campaignsList) {
        return (
            <StyledExplore>
                <h1>Explore</h1>
                <form onSubmit={handleSearch}>
                    <input type="text" placeholder="Search for a campaign..." value={searchTerm} onChange={handleChange}></input>
                    <button className="secondary" type="submit">Search</button>
                </form>
                {campaignsList.length > 0 ? (
                    <ul>
                        {campaignsList.map(campaign => 
                            <CampaignCard 
                                key={campaign.id} 
                                id={campaign.id} 
                                image={campaign.bannerImage} 
                                name={campaign.name} 
                                summary={campaign.summary} 
                            />
                        )}
                    </ul>
                ) : (
                    <p>No campaigns found. Try again.</p>
                )}
            </StyledExplore>
        );
    }
    else if (!isLoading && error) {
        return <Error />;
    }
    else {
        return <Loader />;
    }
}

export default ExploreView;