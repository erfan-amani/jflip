import React from 'react';
import { Link } from 'react-router-dom';
import Member from './Member';
import './AboutUs.css';
import image from '../steve.jpg';
import closeIcon from '../icons/close-outline.svg';

const AboutUs = () => {
  const members = [
    { name: 'Erfan AmanAbadi', image },
    { name: 'Mohammad Ahmadi', image },
    { name: 'Mahyar Haddad', image },
    { name: 'Reza Jafari', image },
    { name: 'Mahdi Almasi', image },
  ];

  return (
    <>
      <Link to="/board">
        <img className="close-icon" src={closeIcon} alt="close icon" />
      </Link>
      <div className="about-us">
        <div className="title">
          <h1>
            <span className="jflip">jflip</span>
            <br />
            Who we are
          </h1>
        </div>
        <div className="team">
          <div className="ui five column grid">
            {members.map((member) => (
              <Member
                key={member.name}
                name={member.name}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
  // const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);

  // const myArrow = ({ type, onClick, isEdge }) => {
  //   const pointer = type === consts.PREV ? '👈' : '👉';
  //   return (
  //     <span onClick={onClick} disabled={isEdge}>
  //       {pointer}
  //     </span>
  //   );
  // };

  // return (
  //   <div className="App">
  //     <div className="carousel-wrapper">
  //       <Carousel
  //         breakPoints={breakPoints}
  //         pagination={false}
  //         renderArrow={myArrow}
  //       >
  //         {items.map((item) => (
  //           <div class="ui card">
  //             <a class="image" href=".">
  //               <img src={image} alt={`member${item}`} />
  //             </a>
  //             <div class="content">
  //               <a class="header" href=".">
  //                 Steve Jobes
  //               </a>
  //               {/* <div class="meta">
  //                 <a>Last Seen 2 days ago</a>
  //               </div> */}
  //             </div>
  //           </div>
  //         ))}
  //       </Carousel>
  //     </div>
  //   </div>
  // );
};

export default AboutUs;
