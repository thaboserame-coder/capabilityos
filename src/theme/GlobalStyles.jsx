/**
 * Global stylesheet for CapabilityOS.
 *
 * Bug fix (see CHANGELOG "Fixed"): the original prototype imported the
 * Google Font family "Cormorant+Garant", which does not exist. The intended
 * family is "Cormorant Garamond". Because the import silently failed, every
 * display heading across the app fell back to the browser default serif,
 * quietly breaking the brand typography. The corrected family name is now
 * the single source of truth in `theme/tokens.js`.
 */
export function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{background:#030B16;font-family:'DM Sans',sans-serif;color:#D4E8F5;min-height:100vh}
  input,textarea,button{font-family:'DM Sans',sans-serif}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.12);border-radius:2px}
  .ch h3{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:500;color:#D4E8F5;margin:1.25rem 0 .5rem;line-height:1.3}
  .ch h3:first-child{margin-top:0}.ch p{font-size:14px;line-height:1.8;color:#7A9BB8;margin-bottom:.75rem}.ch p:last-child{margin-bottom:0}
  .ch strong{font-weight:500;color:#D4E8F5}.ch ul{padding-left:1.3rem;margin-bottom:.75rem}.ch li{font-size:14px;line-height:1.7;color:#7A9BB8;margin-bottom:3px}
  .tcard{transition:all .2s}.tcard:hover{border-color:rgba(255,255,255,0.13)!important;transform:translateY(-2px);background:#0C1B30!important}
  .mcard{transition:all .15s}.mcard:hover{border-color:rgba(255,255,255,0.13)!important}
  .nb{transition:all .15s}.nb:hover{background:#112244!important;border-color:rgba(255,255,255,0.13)!important}
  .qopt{transition:all .15s}.qopt:hover:not([disabled]){border-color:rgba(255,255,255,0.13)!important;background:#112244!important}
  .fade-in{animation:fadeIn .3s ease}
  @media (prefers-reduced-motion: reduce){
    .fade-in,.toast-in,.badge-pop,.xp-bar,.tcard,.mcard,.nb,.qopt{animation:none!important;transition:none!important}
  }
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastIn{from{transform:translateY(80px) scale(0.9);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
  .toast-in{animation:toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards}
  @keyframes badgePop{0%{transform:rotate(-12deg) scale(0);opacity:0}60%{transform:rotate(4deg) scale(1.12)}100%{transform:rotate(0) scale(1);opacity:1}}
  .badge-pop{animation:badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards}
  .xp-bar{transition:width 0.9s cubic-bezier(0.4,0,0.2,1)}
  @keyframes spin{to{transform:rotate(360deg)}}
  .visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  :focus-visible{outline:2px solid #00D4E8;outline-offset:2px}
`;
