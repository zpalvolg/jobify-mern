import main from '../assets/images/main.svg'
import Wrapper from '../assets/wrappers/LandingPage'
import {Logo} from '../components'

function Landing() {
    return (
      <Wrapper>
        <nav>
            <Logo/>
        </nav>
        <div className="container page">
            <div className="info">
                <h1>job <span>tracking</span> app</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu diam euismod, viverra ante sed, rhoncus dolor. Vestibulum nisl tortor, tincidunt nec eros vel, iaculis tempor mi. Nam at diam non sapien posuere tristique ut quis mi. Mauris id sem vel diam commodo vehicula. Nulla suscipit, nisl eget gravida cursus, leo dui commodo risus, in pulvinar est urna nec tortor. Cras euismod turpis sapien, quis faucibus sem molestie viverra. Nunc ut turpis sit amet massa ultricies ultricies vel eu est. 
                </p>
                <button className="btn btn-hero">Login/Register</button>
            </div>
            <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    );
}
  
export default Landing;
  