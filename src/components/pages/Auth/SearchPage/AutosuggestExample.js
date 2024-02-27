import { useState } from "react";
import AutoSuggest from "react-autosuggest";
import "./SearchPage.scss";

const AutosuggestExample = ({allusers, navigate}) => {

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const lowerCasedCompanies = allusers.map(user => {
    return {
      username: user.username,
      avatar: user.photoURL
    };
  });

  function getSuggestions(value) {
    const ffilteredArray = lowerCasedCompanies.filter(user => {
      if(value){
      return user.username.toLowerCase().includes(value.trim().toLowerCase())
      }
    });
      return ffilteredArray;
    }
    
  return (
    <div className="autoSuggest-container">
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionsClearRequested={() => setSuggestions([])}
        onSuggestionsFetchRequested={({ value }) => {
          setValue(value);
          setSuggestions(getSuggestions(value));
        }}
        onSuggestionSelected={(_, { suggestionValue }) =>{
          navigate(`/userProfilepage?username=${suggestionValue}`);
        }
        }
        getSuggestionValue={suggestion => suggestion.username}
        renderSuggestion={suggestion => <div className="search-users">
          <div className="each user">
            <img src={ suggestion.avatar || 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg'} alt="avatar"/>
            <span> {suggestion.username}</span>
          </div>
        </div>}
        inputProps={{
          placeholder: "username...",
          value: value,
          onChange: (_, { newValue, method }) => {
            setValue(newValue);
          }
        }}
        highlightFirstSuggestion={true}
      />
    </div>
  );
};

export default AutosuggestExample;
