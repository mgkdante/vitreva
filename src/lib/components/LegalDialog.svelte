<script lang="ts">
  import type { Content } from '#lib/content/index.ts';

  let { kind, content, onClose }: { kind: 'privacy' | 'terms' | null; content: Content['legal']; onClose: () => void } = $props();
  let dialog: HTMLDialogElement;
  let previousFocus: HTMLElement | null = null;

  $effect(() => {
    if (kind && !dialog.open) {
      previousFocus = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!kind && dialog.open) {
      dialog.close();
      previousFocus?.focus();
    }
  });
</script>

<dialog bind:this={dialog} aria-labelledby="legal-title" onclose={onClose} oncancel={onClose}>
  {#if kind}
    <div class="dialog-heading"><h2 id="legal-title">{content[kind].title}</h2><button type="button" class="text-button" onclick={onClose}>{content.close}</button></div>
    {#each content[kind].paragraphs as paragraph}<p>{paragraph}</p>{/each}
  {/if}
</dialog>

<style>
  dialog { max-width: 680px; width: calc(100% - 40px); max-height: calc(100dvh - 64px); margin: auto; border: 1px solid var(--line); border-radius: 26px; padding: 32px; color: var(--ink); background: white; box-shadow: 0 24px 80px rgb(0 0 0 / 25%); }
  dialog::backdrop { background: rgb(0 0 0 / 60%); backdrop-filter: blur(5px); }
  .dialog-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; }
  h2 { font-size: 28px; line-height: 1.2; }
  p { margin-top: 16px; font-size: 15px; line-height: 24px; }
  .text-button { font-size: 14px; flex-shrink: 0; min-height: 32px; }
  @media (max-width: 599px) { dialog { padding: 24px; } h2 { font-size: 24px; } }
</style>
