import React from 'react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const HeaderSocials = () => {
    return (
        <div
            className='home__socials'
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <a
                href='https://www.github.com/JuanJaramillo12004'
                className='home__social-link'
                target='_blank'
                rel='noreferrer'
            >
                <FaGithub />
            </a>

            <a
                href='https://www.linkedin.com/in/juan-eduardo-jaramillo-guerrero-5996b3267/'
                className='home__social-link'
                target='_blank'
                rel='noreferrer'
            >
                <FaLinkedinIn />
            </a>
        </div>
    );
};

export default HeaderSocials;
