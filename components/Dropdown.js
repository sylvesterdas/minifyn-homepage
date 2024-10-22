const Dropdown = ({ label, options, selected = '', onChange = Function }) => {
  return (
    <div className="w-full my-2 mx-1">
      <select 
        onChange={e => onChange(e.target.value)}
        value={selected}
        role="button"
        className="w-full text-secondary border-2 border-secondary bg-transparent rounded-md relative px-2 py-[6px] border-r-[16px] border-solid"
      >
        {!selected && <option className="text-center" value="">{label}</option>}
        {
          Object.keys(options)?.map((key) => (
            <option className="text-center" key={key} value={key}>{options[key]}</option>
          ))
        }
      </select>
    </div>
  )
}

export default Dropdown;
