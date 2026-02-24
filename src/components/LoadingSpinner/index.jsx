
export default function Spinner({ 
  size = 30, 
  color = '#3498db', 
  thickness = 2,
  speed = 2 
}){
  const spinnerStyle = {
    width: size,
    height: size,
    border: `${thickness}px solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${thickness}px solid ${color}`,
    borderRadius: '50%',
    animation: `spin ${1.5 / speed}s linear infinite`,
    
  };

  return (
    <div style={{ width:'100vw',height:'90vh',display:"flex",justifyContent:"center",alignItems:'center' }}>
      <div style={spinnerStyle}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};


