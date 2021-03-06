import React from "react";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import {render, screen } from '@testing-library/react';
import { testCampaign } from "../../../utils/testCampaign";
import SupporterCard from "../SupporterCard";

describe('supporter card', () => {
    const supporter = Object.values(testCampaign.supporters)[0];
    
    it('renders the supporters name', () => {
        render(
            <BrowserRouter>
                <SupporterCard
                    id={supporter.id}
                    donationTotal={supporter.donationTotal}
                />
            </BrowserRouter>
        );
        
        expect(screen.getByText(supporter.id)).toBeInTheDocument();
    });

    it('renders the donation total', () => {
        render(
            <BrowserRouter>
                <SupporterCard
                    id={supporter.id}
                    donationTotal={6000}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('$6,000')).toBeInTheDocument();
    });

    it('renders donation total from props', () => {
        render(
            <BrowserRouter>
                <SupporterCard
                    id={supporter.id}
                    donationTotal={supporter.donationTotal}
                />
            </BrowserRouter>
        );

        expect(screen.getByText(`$${supporter.donationTotal.toLocaleString()}`)).toBeInTheDocument();
    });

    it ('links to the supporter', () => {
        render(
            <BrowserRouter>
                <SupporterCard
                    supporter={supporter.id}
                    donationTotal={supporter.donationTotal}
                />
            </BrowserRouter>
        );
        expect(screen.getByRole('link')).toBeInTheDocument();
    });
});