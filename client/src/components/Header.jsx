import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import{AiOutlineSearch} from'react-icons/ai'
import{FaMoon,FaSun} from'react-icons/fa'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { signOutSuccess } from '../redux/user/userSlice'
import { useEffect, useState } from 'react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const path = useLocation().pathname
    const {currentUser} = useSelector((state)=>state.user)
    const dispatch = useDispatch();
    const theme = useSelector((state)=>state.theme)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const searchTermFromUrl = urlParams.get('searchTerm');
      if (searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
      }
    }, [location.search]);

    console.log("Current theme:", theme);
    const handleSignout = async()=>{
        try {
          const res = await fetch('/api/user/signout',{
            method:'POST',
    
          })
          const data = await res.json()
          if(!res.ok){
            console.log(data.message)
          }else{
            dispatch(signOutSuccess())
          }
        } catch (error) {
          console.log(error.message)
        }
      }

      const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
      };

    
  return (
    <Navbar className='border-b-2'>
        {/* logo */}
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-cyan-600 rounded-lg text-white'>Alex's</span>
            Blog
        </Link>

        {/* 表单用来输入框  */}
        <form onSubmit={handleSubmit}>
            <TextInput
                type='text'
                placeholder='Search..'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>

        {/* 搜索icon用来代替缩小后输入框 */}
        <Button className='w-12 h-10 lg:hidden' color='gray'>
            <AiOutlineSearch/>
        </Button>

        
        <div className='flex gap-2 md:order-2'>
            {/* 切换黑白的图标 */}
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>{dispatch(toggleTheme())}}>
                {theme==="light"?<FaSun/>:<FaMoon/>}
                
            </Button>
            {currentUser?(
                <Dropdown 
                arrowIcon = {false}
                inline
                label = {
                    // <Avatar 
                    // alt='user'
                    // image = {currentUser.profilePicture}
                    // rounded
                    // />


                    <div>
                    <img 
                    className='rounded-full h-3 w-3 '
                        src={currentUser.profilePicture}
                        alt="user" 
                        style={{ width: '40px', height: '40px' }}
                    />
                </div>
                }>
                    <Dropdown.Header>
                        <span className='block text-sm '>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                </Dropdown>
            ):(
                            // {/* Signin按钮 */}
            <Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
        </Link>
            )}

        </div>
        {/* 菜单 用navbar.taggle就可以实现*/}
        <Navbar.Toggle/>
        <Navbar.Collapse>
            <Navbar.Link active={path==='/'} as={'div'}>
                <Link to='/'>Home</Link>
            </Navbar.Link>

            <Navbar.Link active={path==='/about'} as={'div'}>
                <Link to='/about'>About</Link>
            </Navbar.Link>

            <Navbar.Link active={path==='/projects'} as={'div'}>
                <Link to='/projects'>Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>
        
    </Navbar>
  )
}
