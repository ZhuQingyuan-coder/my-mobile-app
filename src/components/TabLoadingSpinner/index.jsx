
export default function TabsSpinner({ 
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
    <div style={{ height:'50vh',display:"flex",justifyContent:"center",alignItems:'center',flexDirection:'column' }}>
      <div style={spinnerStyle}></div>
      <div className="fontColorGray marginTop fontSize15">加载中...</div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};