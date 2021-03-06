import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    getCampaignData, 
    getSupporterData, 
    getDonationData,
    updateCampaignOnDonation,
    updateFollowers } from '../../utils/campaigns';
import styled from "styled-components/macro";
import { MdClose } from 'react-icons/md';
import CampaignBanner from "./CampaignBanner";
import CampaignInfo from "./CampaignInfo";
import CampaignGoal from './CampaignGoal';
import CampaignSupport from "./CampaignSupport";
import CampaignAbout from "./CampaignAbout";
import CampaignTopSupport from "./CampaignTopSupport";
import CampaignDonations from './CampaignDonations';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

const StyledCampaign = styled.main`
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px 0 100px 0;

    h2 {
        margin: 0.7rem 0;
    }

    .sections {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        padding: 0 1rem;
        margin-top: 1rem;
    }

    .section-column {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media(min-width: 768px) {
        .sections {
            grid-template-columns: 1fr 1fr;
            margin-top: 0;
        }
    }
`;

const StyledSupportOverlay = styled.div`
    height: calc(100vh + 140px);
    width: 100vw;
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: -66px;
    display: ${props => props.active === true ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;

    form {
        width: 100%;
        max-width: 350px;
        background-color: #fff;
    }

    .close-button {
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
        color: #fff;
        display: flex;
   
        svg {
            font-size: 1.5rem;
        }
    }

    @media (min-width: 768px) {
        height: calc(100vh + 80px);

        form {
            max-width: 400px;
        }
    }
`;

const CampaignView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [supporters, setSupporters] = useState([]);
    const [donationIsActive, setDonationIsActive] = useState(false);
    let { campaignName } = useParams();

    const getData = async () => {
        setIsLoading(true);
        const campaignData = await getCampaignData(campaignName);
        
        if (campaignData) {
            const supporterData = await getSupporterData(campaignData.supporters);
            const donationData = await getDonationData(campaignData.donations);

            setCampaign(campaignData);
            setSupporters(supporterData);
            setDonations(donationData);
        }
        else {
            setError('Campaign not found.');
        }
        setIsLoading(false);
    }

    const handleFollow = async (followerId) => {
        setIsLoading(true);
        await updateFollowers(followerId, campaignName);
        getData();
    }

    const handleDonation = async (newDonation) => {
        setIsLoading(true);
        setDonationIsActive(false);
        await updateCampaignOnDonation(campaignName, newDonation);
        getData();
    }

    useEffect(() => {
        setIsLoading(true);
        getData();
    }, [campaignName]);

    useEffect(() => {
        if (donationIsActive) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
    }, [donationIsActive]);

    if (!isLoading && campaign) {
        return (
            <>
                <StyledSupportOverlay active={donationIsActive} >
                    <div style={{minWidth: '180px'}}>
                       <button className="close-button" onClick={() => setDonationIsActive(false)}><MdClose /> Close</button>
                    </div>
                    <CampaignSupport handleDonation={handleDonation} />
                </StyledSupportOverlay>

                <StyledCampaign>
                    <CampaignBanner 
                        name={campaign.name}
                        id={campaign.id}
                        summary={campaign.summary}
                        image={campaign.bannerImage} 
                    />
                    <CampaignInfo 
                        avatar={campaign.avatar}
                        supporters={campaign.supporters}
                        followers={campaign.followers}
                        handleFollow={handleFollow}
                        posts={campaign.posts} 
                        setDonationIsActive={setDonationIsActive}
                        uid={campaign.uid}
                    />

                    <div className="sections">
                        <div className="section-column">
                            <div>
                                <h2>About</h2>
                                <CampaignAbout about={campaign.about} />
                            </div>

                            <div>
                                <h2>Support</h2>
                                <CampaignSupport handleDonation={handleDonation} />
                            </div>
                        </div>

                        <div className="section-column">
                            {campaign.currentGoal.name && 
                                <div>
                                    <h2>Current Goal</h2>
                                    <CampaignGoal goal={campaign.currentGoal} setDonationIsActive={setDonationIsActive} />
                                </div>
                            }
                            
                            <div>
                                <h2>Top Supporters</h2> 
                                <CampaignTopSupport supporters={supporters} setDonationIsActive={setDonationIsActive} />
                            </div>
                        
                            {campaign.donations.length > 0 && (
                                <div>
                                    <h2>Recent Donations</h2>
                                    <CampaignDonations donations={donations} />
                                </div>
                            )}
                        </div>
                    </div>
                </StyledCampaign>
            </>
        );
    }
    else if (!isLoading && error) {
        return <Error />;
    }
    else {
        return <Loader />;
    }
}

export default CampaignView;