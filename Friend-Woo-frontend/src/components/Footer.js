import './Footer.css';

function Footer(props) {
    return (
        <footer className='footer'>
            <p>
                SMART CONTRACT ADDRESS:&nbsp;
                <br />
                <span>
                    <a className='contract-link' href={`https://rinkeby.etherscan.io/address/${props.address}`} target='_blank' rel='noreferrer'>
                        {props.address}
                    </a>
                </span>
            </p>
        </footer>
    )
}

export default Footer;