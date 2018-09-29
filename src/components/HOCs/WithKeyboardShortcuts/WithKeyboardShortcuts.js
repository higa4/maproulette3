import { connect } from 'react-redux'
import _get from 'lodash/get'
import { addKeyboardShortcutGroup,
         removeKeyboardShortcutGroup,
         addKeyboardShortcut,
         removeKeyboardShortcut }
       from '../../../services/KeyboardShortcuts/KeyboardShortcuts'
import KeyMappings from '../../../services/KeyboardShortcuts/KeyMappings'

const mapStateToProps = state => {
  return {
    keyboardShortcutGroups: KeyMappings,
    activeKeyboardShortcuts: _get(state, 'currentKeyboardShortcuts.groups', {}),
  }
}
const textInputActive = function(event) {
  return event.target.nodeName.toLowerCase() === 'input' &&
         event.target.getAttribute('type').toLowerCase() === 'text'
}

const mapDispatchToProps = dispatch => {
  return {
    activateKeyboardShortcutGroup: (shortcutGroup, handler) => {
      document.addEventListener("keydown", handler, false)
      dispatch(addKeyboardShortcutGroup(shortcutGroup))
    },
    deactivateKeyboardShortcutGroup: (groupName, handler) => {
      document.removeEventListener("keydown", handler)
      dispatch(removeKeyboardShortcutGroup(groupName))
    },
    activateKeyboardShortcut: (groupName, shortcut, handler) => {
      document.addEventListener("keydown", handler, false)
      dispatch(addKeyboardShortcut(groupName, shortcut))
    },
    deactivateKeyboardShortcut: (groupName, shortcutName, handler) => {
      document.removeEventListener("keydown", handler)
      dispatch(removeKeyboardShortcut(groupName, shortcutName))
    },
    textInputActive: textInputActive,
    quickKeyHandler: (key, handler) => (event => {
      if (textInputActive(event)) {
        return // ignore typing in inputs
      }

      if (event.key === key) {
        handler()
      }
    }),
  }
}

const WithKeyboardShortcuts =
  WrappedComponent => connect(mapStateToProps, mapDispatchToProps)(WrappedComponent)

export default WithKeyboardShortcuts
