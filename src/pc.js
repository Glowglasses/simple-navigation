import {
  addFormat,
  addSiteFormat,
  addSiteAnimation,
  editSite,
  changeSite,
  addLocalStorage,
  getSiteIndexByName,
  removeLocalStorage,
  getValueAndNameById,
  createId
} from './utils'

export default function pcJs() {
  let $search_frame = $('.search-frame')
  let $add = $('.add')
  let $addWindow = $('#add-window')
  let $cancelButton = $('.cancelButton')
  let $siteList = $('.site-list')
  let deleteList = []
  let isDispatch = true
  let localSiteData = JSON.parse(localStorage.getItem('siteData') || '[]')
  let isEdit = false
  let isDelete = false
  document.onmousedown = (() => {
    if ($addWindow.css('visibility') === 'hidden') {
      $('ul > li').removeClass()
      $add.css('visibility', 'visible')
      if (deleteList.length > 0) {
        removeLocalStorage(deleteList)
        deleteList.length = 0
      }
    } else if ($('ul>li').hasClass('edit')) {
      $search_frame.blur()
    }
    isEdit = false
  })
  
  function loadSite() {
    $('.add-container').siblings().remove()
    if (localSiteData.length > 0) {
      appendSite(JSON.parse(localStorage.getItem('siteData')))
    }
  }
  
  $(function () {
    loadSite()
  })
  
  $addWindow.on('mousedown', (e) => {
    e.stopPropagation()
  })
  
  $search_frame.focus(() => {
    if ($addWindow.hasClass('add-window-animation-display')) {
      $search_frame.blur()
    } else {
      $('.searchButton').attr('style', 'visibility: visible')
    }
    
  })
  $search_frame.blur((e) => {
    if (e.target.value !== '') {
    } else {
      $('.searchButton').attr('style', 'visibility: hidden')
    }
    
  })
  
  $($search_frame).on('keyup', (e) => {
    let val = $search_frame.val()
    if (e.keyCode === 13) {
      if (val === '') {
        location.href = 'https://www.baidu.com'
      } else if (val.substr(0, 4) === 'http') {
        location.href = val
      } else if (val.substr(0, 3) === 'www') {
        location.href = 'https://' + val
      } else {
        location.href = 'https://www.baidu.com/s?wd=' + val
      }
      $search_frame.val('')
    }
    
  })

  $('.searchButton').on('mousedown', () => {
    let val = $search_frame.val()
    if (val === '') {
      $search_frame.blur()
    } else if (val.substr(0, 4) === 'http') {
      location.href = val
    } else if (val.substr(0, 3) === 'www') {
      location.href = 'https://' + val
    } else {
      location.href = 'https://www.baidu.com/s?wd=' + val
    }
    $search_frame.val('')
  })
  
  
  $add.on('mousedown', ((e) => {
    if (e.button === 0) {
      e.stopPropagation()
      if ($add.css('opacity') === '0.3') {
        $add.attr('style', 'opacity: 1;')
        addSiteAnimation()
      }
    }
    
  }))
  
  
  $cancelButton.on('mousedown', (() => {
    isDispatch = true
    $('ul > li').removeClass()
    $add.css('visibility', 'visible')
    $addWindow.removeClass()
    addSiteFormat()
    addFormat()
    if ($('.changeButton') !== undefined) {
      setTimeout(() => {
        $('.changeButton').text('添加').addClass('confirmButton').removeClass('changeButton')
      }, 150)
      
    }
  }))
  
  $siteList.on('mouseup', (e) => {
    e.preventDefault()
    console.log(e.target)
    if (e.target.tagName === 'LI') {
      if (e.button === 0) {
        console.log(getValueAndNameById($(e.target).data('id')).url)
        location.href = getValueAndNameById($(e.target).data('id')).url
      }
    }else if (e.target.tagName === 'SPAN'){
      if (e.button === 0) {
        location.href = getValueAndNameById($(e.target).parent().data('id')).url
      }
    }
    if (e.button === 2) {
      isEdit = true
      if (!$('ul>li').hasClass('edit')) {
        $('ul>li').addClass('selected-site')
        setTimeout(() => {
          $('ul>li').addClass('unselected-site delete edit')
          $add.css('visibility', 'hidden')
        }, 50)
      }
    }
  })
  
  $siteList.on('mousedown', (e) => {
    if (e.button === 0) {
      if ($('.delete')[0] !== null && $('.delete')[0] !== undefined) {
        isDispatch = false
        let deleteScope = {}
        let editScope = {}
        let basePosition = e.target.getBoundingClientRect()
        if (e.target.tagName === 'SPAN') {
          basePosition = e.target.parentNode.getBoundingClientRect()
        }
        deleteScope.top = basePosition.y - 10
        deleteScope.bottom = deleteScope.top + 20
        deleteScope.left = basePosition.x - 10
        deleteScope.right = deleteScope.left + 20
        editScope.top = basePosition.y
        editScope.bottom = basePosition.y + 50
        editScope.left = basePosition.x
        editScope.right = basePosition.x + 50
        if (e.pageX >= deleteScope.left && e.pageX <= deleteScope.right && e.pageY >= deleteScope.top && e.pageY <= deleteScope.bottom) {
          e.stopPropagation()
          if ($addWindow.hasClass('') || $addWindow.hasClass('add-window-animation-hidden')) {
            removeSite(e)
            addSiteFormat()
          }
        } else if (e.pageX >= editScope.left && e.pageX <= editScope.right && e.pageY >= editScope.top && e.pageY <= editScope.bottom) {
          e.stopPropagation()
          if (e.target.tagName === 'LI') {
            editSite($(e.target.children[0]).data('id'))
          } else if (e.target.tagName === 'SPAN') {
            editSite($(e.target).data('id'))
          }
        }
      }
    }
    
  })
  
  function removeSite(e) {
    console.log('remove')
    deleteList.push(parseInt($(e.target.children[0]).data('id')))
    $(e.target).remove()
    if ($siteList.children('li').length === 0) {
      addFormat()
      removeLocalStorage(deleteList)
      deleteList.length = 0
    }
  }
  
  $addWindow.on('mousedown', (e) => {
    if ($(e.target).text() === '添加') {
      let site_name = $('.name').val()
      let site_url = $('.url').val()
      if (site_name && site_url) {
        addSite()
        addSiteFormat()
      }
      
    }
    if ($(e.target).text() === '修改') {
      changeSite()
      loadSite()
      $('.changeButton').text('添加').addClass('confirmButton').removeClass('changeButton')
      addSiteFormat()
    }
    
  })
  
  
  function appendSite(siteObjects) {
    siteObjects.forEach(item => {
      let $newLi = $(`
                <li data-id=${item.id}>
                    <span>${item.name.slice(0, 1)}</span>
                    <span>${item.name}
                    </span>
                </li>
            `)
      $newLi.insertBefore($('.add-container'))
      $newLi.on('contextmenu', (e) => {
        e.preventDefault()
      })
    })
  }
  
  function addSite() {
    let site_name = $('.name').val()
    let site_url = $('.url').val()
    if (site_name && site_url) {
      let siteObj = {}
      if (site_url.indexOf('http') === -1) {
        siteObj = {name: site_name, url: 'https://' + site_url}
      } else {
        siteObj = {name: site_name, url: site_url}
      }
      siteObj['id'] = createId()
      addLocalStorage(siteObj)
      appendSite([siteObj])
      addFormat()
      $('.name').val('')
      $('.url').val('')
    }
  }
}