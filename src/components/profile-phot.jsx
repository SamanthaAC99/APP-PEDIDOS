import profile from '../assets/profile3.png';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
export default function ProfilePhoto(props){


    if(props.condition){
        return (
            <>
                <img  src={props.url}  width={220} height={220} style={{borderRadius:10}}/>
            </>
        );
    }else{
        return(
            <div  style={{borderRadius:5,borderStyle:"dashed",color:"#B2BABB",display:"flex",borderWidth:5,alignItems:"center",justifyContent:"center"}}>
            <AddPhotoAlternateIcon  sx={{width:200,height:200}}/>
        </div>
        );
    }
}